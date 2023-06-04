import { AppBar } from 'components/AppBar';
import {
    Button,
    Center,
    Flex,
    Stack,
    View,
    Text,
    HStack,
    Icon,
    Spacer,
    Image,
    ScrollView,
    VStack,
    Box,
    Pressable,
    IconButton,
    useTheme,
} from 'native-base';
import { AppTabsNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppTabsStackScreenProps } from 'types';
import { MessageItem } from './components/MessageItem';
import { EvilIcons, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, TouchableHighlight, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { addDoc, collection, getDoc, onSnapshot, query, doc, getDocs, where, or, documentId, orderBy, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from 'config/firebase';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

const currentUserId = "vSiv500SKpWqxPLOjYVY";


const userList = [
    {
        name: 'Thang abc dgac ',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: false,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: true,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: true,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: false,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: true,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: true,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: true,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: false,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: false,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: false,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: false,
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        isRead: false,
    },
];


import Swipeable from 'react-native-gesture-handler/Swipeable';
import { APP_PADDING } from 'app/constants/Layout';
import {
    BellIcon,
    BellOffIcon,
    EllipsisIcon,
    LinkIcon,
    LogoutIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
    VolumeMuteIcon,
} from 'components/Icons/Light';
import { ListItem } from './components/ListItem';




export const MessageScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Message>) => {
    const { navigation } = props;
    const { colors } = useTheme();
    const [messes, setMesses] = useState([])

    useEffect(() => {

        const fetchRoomData = async () => {
            const q = query(collection(db, "SingleRoom"), or(where('userId1', '==', currentUserId), where('userId2', '==', currentUserId)));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messes = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    messes.push({
                        id: doc.id,
                        ...data
                    });
                });
                setMesses(messes)
                console.log("changeeeeeee")
            });
        }

        fetchRoomData().catch(console.error)
    }, []);



    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Channels',
            // backBu
            headerLeft: () => (
                <HStack mx={4}>
                    <BellIcon size="md" color="primary.900" />
                </HStack>
            ),

            headerRight: () => (
                <HStack space={4} alignItems={'center'} mr={4}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootNavigatekey.Search)}>
                        <SearchIcon size="md" color="primary.900" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <PlusIcon size="md" color="primary.900" />
                    </TouchableOpacity>
                </HStack>
            ),
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [props.navigation]);

    return (
        <View backgroundColor={'white'} flex={1}>
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <VStack space={2}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space={4}>
                            {userList.map((item, idx) => (
                                <TouchableOpacity onPress={async () => {
                                    try {
                                        const room = await addDoc(collection(db, "SingleRoom"), {
                                            userId1: "1",
                                            userId2: "2",
                                            pinMessage: [],
                                            unnotification: [],
                                            messages: [],
                                            imageStore: [],
                                            linkStore: [],
                                            lastMessage: "3"
                                        });
                                        console.log("Document written with ID: ", room.id);

                                        const message = await addDoc(collection(db, "Message"), {
                                            type: "text",
                                            content: "2",
                                            files: [],
                                            sender: "1",
                                        });
                                        console.log("Document written with ID: ", message.id);


                                    } catch (e) {
                                        console.error("Error adding document: ", e);
                                    }
                                }}>
                                    <VStack width={16} space={1} alignItems="center" ml={idx === 0 ? 4 : 0}>
                                        <Center width={16} height={16} position="relative">
                                            <Image
                                                borderRadius={100}
                                                alt="..."
                                                width="full"
                                                height="full"
                                                source={{ uri: item.avt }}
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
                                </TouchableOpacity>

                            ))}
                        </HStack>
                    </ScrollView>
                    <VStack space={2}>
                        {messes.map((item, idx) => (
                            <ListItem
                                {...item}
                                key={item.id}
                                onPress={async () => {
                                    navigation.navigate(RootNavigatekey.MessageDetail, { type: "", roomId: "" });
                                    const roomRef = doc(db, "SingleRoom", item.id);
                                    await updateDoc(roomRef, {
                                        reads: arrayUnion(currentUserId)
                                    });

                                }}
                            />
                        ))}
                    </VStack>
                </VStack>
            </ScrollView>
        </View>
    );
};

