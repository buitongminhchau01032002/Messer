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

export const AddToMultiRoomScreen = (props: RootStackScreenProps<RootNavigatekey.AddToMulti>) => {
    const { navigation } = props;
    const { colors } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [isInputFocused, setInputFocused] = useState(false);
    const [searchingUsers, setSearchingUser] = useState([]);
    const [selectedUsers, setSeletectedUser] = useState([]);
    const currentUserId = auth.currentUser?.uid;

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
                selected: 'false',
                ...u.data(),
            });
        });
        setSearchingUser(searchUser);
    };

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Search',
            headerTransparent: false,
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [props.navigation]);

    const handleNavigate = async (otherUserId: string) => {
        const idx = selectedUsers.indexOf(otherUserId);
        if (idx > -1) {
            selectedUsers.splice(idx, 1);
        } else {
            selectedUsers.push(otherUserId);
        }
        setSeletectedUser(selectedUsers);
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
                        <UserItem
                            {...item}
                            key={idx}
                            selected={selectedUsers.includes(item.id)}
                            onPress={async () => {
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

const UserItem = (item: { avatar: string; name: string; selected: boolean; onPress?: () => void }) => {
    useEffect(() => {
        console.log('ha');
    }, [item.selected]);
    return (
        <Pressable onPress={item.onPress}>
            <View>
                <HStack space={6} alignItems={'center'} my={2}>
                    <Image alt="..." source={{ uri: item.avatar }} size={16} borderRadius={100}></Image>
                    <Text bold fontSize="md">
                        {item.name}
                    </Text>
                    {item.selected ? <Text>s</Text> : <></>}
                </HStack>
                {/* <Divider/> */}
            </View>
        </Pressable>
    );
};
