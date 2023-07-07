import { APP_PADDING } from 'app/constants/Layout';
import { SearchIcon } from 'components/Icons/Light/Search';
import { auth, db } from 'config/firebase';
import { query, collection, where, onSnapshot, or, getDocs, addDoc, serverTimestamp, and } from 'firebase/firestore';
import {
    ScrollView,
    View,
    Text,
    HStack,
    useTheme,
    TextField,
    Input,
    Box,
    VStack,
    Image,
    Divider,
    Pressable,
} from 'native-base';
import { RootNavigatekey } from 'navigation/navigationKey';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackScreenProps } from 'types';
import { ListItem } from './component/ListItem';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from 'hooks/index';

export const SearchScreen = (props: RootStackScreenProps<RootNavigatekey.Search>) => {
    const { navigation } = props;
    const { colors } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [isInputFocused, setInputFocused] = useState(false);
    const [searchingUsers, setSearchingUser] = useState([]);
    const currentUser = useAppSelector((state) => state.auth.user);


    const fetchUserData = async () => {
        const searchUser = [];
        const q = query(
            collection(db, 'User'),
            where('name', '>=', searchText),
            where('name', '<=', searchText + '\uf8ff'),
        );
        const searchUserSnapshot = await getDocs(q);
        searchUserSnapshot.forEach((u) => {
            searchUser.push({
                id: u.id,
                ...u.data(),
            });
        });
        
        setSearchingUser(searchUser.filter((e) => {return !(currentUser.blockIds.includes(e.id) || e.id == currentUser?.id)}));
    };

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Search',
            headerTransparent: false,
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
            headerRight: () => (
                <Pressable
                    onPress={() => {
                        navigation.navigate(RootNavigatekey.QRScan);
                    }}
                >
                    <FontAwesome name="qrcode" size={24} color="black" />
                </Pressable>
            ),
        });
    }, [props.navigation]);

    const handleNavigate = async (otherUserId: string) => {
        // const roomeRef = collection(db, 'SingleRoom');
        const q = query(
            collection(db, 'SingleRoom'),
            or(
                and(where('user1', '==', currentUser?.id), where('user2', '==', otherUserId)),
                and(where('user2', '==', currentUser?.id), where('user1', '==', otherUserId)),
            ),
        );

        const messes = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            messes.push({
                id: doc.id,
                type: 'single',
                ...data,
            });
        });

        if (messes.length != 0) {
            navigation.navigate(RootNavigatekey.MessageDetail, { type: 'single', room: messes[0] });
        } else {
            const newRoomData = {
                user1: auth.currentUser?.uid,
                user2: otherUserId,
            };
            const newRoom = await addDoc(collection(db, 'SingleRoom'), newRoomData);

            const roomData = {
                id: newRoom.id,
                ...newRoomData,
                type: 'single',
            };
            // console.log(roomData);
            navigation.navigate(RootNavigatekey.MessageDetail, { type: 'single', room: roomData });
        }
    };

    return (
        <View backgroundColor={'white'} flex={1} p={8}>
            <ScrollView flex={1}>
                <Text fontWeight={'bold'}>Enter a name</Text>
                <View
                    flex={1}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="#fff"
                    borderBottomWidth={1}
                    borderColor={isInputFocused ? 'red.900' : 'black'}
                >
                    <Input
                        onChangeText={(text) => {
                           // console.log('ádfsadfasdf')
                            setSearchText(text);
                        }}
                        flex={1}
                        placeholder="Input"
                        borderWidth={0}
                        borderRadius={0}
                        color={'blue.900'}
                        mt="2"
                        backgroundColor={'white'}
                        onSubmitEditing={() => fetchUserData().catch(console.error)}
                    />
                    <SearchIcon size={'sm'} color={'red.500'} />
                </View>
                <Text fontWeight={'bold'} marginY={8}>
                    Channel
                </Text>
                <VStack space={4}>
                    {searchingUsers.map((item, idx) => (
                        <ListItem
                            {...item}
                            key={idx}
                            onPress={async () => {
                                // console.log("search", "hello")
                                // navigation.navigate(RootNavigatekey.MessageDetail)
                                try {
                                    handleNavigate(item.id);
                                } catch (e) {
                                    console.error('Error adding document: ', e);
                                }
                            }}
                        />
                    ))}
                </VStack>
            </ScrollView>
        </View>
    );
};
