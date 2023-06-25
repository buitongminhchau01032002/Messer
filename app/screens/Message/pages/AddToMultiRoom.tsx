import { APP_PADDING } from 'app/constants/Layout';
import { PhoneIcon } from 'components/Icons/Light';
import { SearchIcon } from 'components/Icons/Light/Search';
import { auth, db } from 'config/firebase';
import Dialog from 'react-native-dialog';

import {
    query,
    collection,
    where,
    onSnapshot,
    or,
    getDocs,
    addDoc,
    serverTimestamp,
    and,
    doc,
    updateDoc,
    arrayUnion,
} from 'firebase/firestore';
import { update } from 'lodash';
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
    Center,
    AddIcon,
    Button,
} from 'native-base';
import { RootNavigatekey } from 'navigation/navigationKey';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { RootStackScreenProps } from 'types';
import { useAppState } from 'native-base/lib/typescript/core/color-mode/hooks';
import { useAppSelector } from 'hooks/index';

export const AddToMultiRoomScreen = (props: RootStackScreenProps<RootNavigatekey.AddToMulti>) => {
    const { navigation, route } = props;
    const currentUser = useAppSelector((state) => state.auth.user);
    const { roomId } = route.params;
    const { colors } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [isInputFocused, setInputFocused] = useState(false);
    const [searchingUsers, setSearchingUser] = useState([]);
    const [selectedUsers, setSeletectedUser] = useState([]);
    const [roomName, setRoomName] = useState('');
    const [nameDialogVisible, setNameDialogVisible] = useState(false);

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
                selected: selectedUsers.includes(u.id),
                ...u.data(),
            });
        });
        setSearchingUser(searchUser);
        console.log(selectedUsers);
    };
    const handleSubmit = async () => {
        if (roomId) {
            const roomRef = doc(db, 'MultiRoom', roomId);
            await updateDoc(roomRef, {
                users: arrayUnion(
                    ...selectedUsers.map((u) => {
                        return u.id;
                    }),
                ),
            });
        }
    };

    const handleCreateRoom = async () => {
        const ids = selectedUsers.map((u) => {
            return u.id;
        });
        if (!ids.includes(currentUser.id)) {
            ids.push(currentUser.id);
        }
        const docRef = await addDoc(collection(db, 'MultiRoom'), {
            name: roomName,
            users: ids,
        });
    };
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HStack space={4}>
                    <Button
                        color={'primary.900'}
                        onPress={() => {
                            if (!roomId) {
                                setNameDialogVisible(true);
                            } else {
                                handleSubmit();
                            }
                        }}
                    >
                        Create
                    </Button>
                </HStack>
            ),
            headerTitle: 'Choose member',
            headerTransparent: false,
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [props.navigation]);

    const handleNavigate = async (otherUserId: any) => {
        const idx = selectedUsers.indexOf(otherUserId);
        if (idx > -1) {
            selectedUsers.splice(idx, 1);
        } else {
            selectedUsers.push(otherUserId);
        }
        setSeletectedUser(selectedUsers);
        const newSearch = searchingUsers.map((u) => {
            if (u.id == otherUserId) {
                return {
                    ...u,
                    selected: !u.selected,
                };
            } else {
                return u;
            }
        });
        setSearchingUser(newSearch);
        console.log(selectedUsers);
        // setSearchingUser(searchingUsers.map((u) => {
        //     return 'a'
        // }))
    };

    return (
        <View backgroundColor={'white'} flex={1} p={8} pt={0}>
            <Dialog.Container visible={nameDialogVisible}>
                <Dialog.Title>Enter Room Name</Dialog.Title>
                <Dialog.Input onChangeText={(t) => setRoomName(t)} />
                <Dialog.Button
                    label="Cancel"
                    onPress={() => {
                        setNameDialogVisible(false);
                    }}
                />
                <Dialog.Button
                    label="Create"
                    onPress={() => {
                        handleCreateRoom();
                    }}
                />
            </Dialog.Container>
            <ScrollView flex={1}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space={4}>
                        {selectedUsers.map((item, idx) => (
                            <Pressable
                                onPress={() => {
                                    handleNavigate(item);
                                }}
                            >
                                <VStack width={16} space={1} alignItems="center" ml={idx === 0 ? 4 : 0}>
                                    <Center width={16} height={16} position="relative">
                                        <Image
                                            borderRadius={100}
                                            alt="..."
                                            width="full"
                                            height="full"
                                            source={{ uri: item.avatar ?? 'yes' }}
                                        ></Image>
                                        <Box
                                            borderWidth={2}
                                            borderColor="white"
                                            borderRadius={100}
                                            position="absolute"
                                            width={4}
                                            height={4}
                                            bg="green.900"
                                            bottom={0}
                                            right={0}
                                        ></Box>
                                    </Center>
                                    <Text textAlign="center" fontSize="xs" isTruncated noOfLines={1}>
                                        {item.name}
                                    </Text>
                                </VStack>
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>
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
                            // selected={selectedUsers.includes(item.id)}
                            onPress={async () => {
                                try {
                                    handleNavigate(item);
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
