import { APP_PADDING } from 'app/constants/Layout';
import { SearchIcon } from 'components/Icons/Light/Search';
import { db } from 'config/firebase';
import { query, collection, where, onSnapshot, or, getDocs } from 'firebase/firestore';
import { ScrollView, View, Text, HStack, useTheme, TextField, Input, Box, VStack, Image, Divider } from 'native-base';
import { RootNavigatekey } from 'navigation/navigationKey';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackScreenProps } from 'types';
import { ListItem } from './component/ListItem';

export const SearchScreen = (props: RootStackScreenProps<RootNavigatekey.Search>) => {
    const { navigation } = props;
    const { colors } = useTheme();
    const [searchText, setSearchText] = useState("");
    const [isInputFocused, setInputFocused] = useState(false);
    const [searchingUsers, setSearchingUser] = useState([]);


    const fetchUserData = async () => {
        const searchUser = []
        const q = query(collection(db, "user"), where('name', '==', searchText));
        const searchUserSnapshot = await getDocs(q);
        searchUserSnapshot.forEach((u) => {
            searchUser.push(u.data());
        });
        setSearchingUser(searchUser);
    }

    // useEffect(() => {


    //     fetchUserData().catch(console.error)
    // }, [searchText]);

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Search',
            headerTransparent: false,
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [props.navigation]);



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
                        onChangeText={(text) => { setSearchText(text) }}
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
                            onPress={() => navigation.navigate(RootNavigatekey.MessageDetail)}
                        />

                    ))}
                </VStack>
            </ScrollView>
        </View>
    );
};
