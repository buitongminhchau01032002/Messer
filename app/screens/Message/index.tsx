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
import {
    addDoc,
    collection,
    getDoc,
    onSnapshot,
    query,
    doc,
    getDocs,
    where,
    or,
    documentId,
    orderBy,
    Timestamp,
    updateDoc,
    arrayUnion,
    and,
} from 'firebase/firestore';
import { auth, db } from 'config/firebase';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

// const currentUserId = "CPYyJYf2Rj2kUd8rCvff";

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
import { useIsFocused } from '@react-navigation/native';
import { useAppSelector } from 'hooks/index';

export const MessageScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Message>) => {
    const { navigation } = props;
    const { colors } = useTheme();
    const [singleRooms, setSingleRooms] = useState([]);
    const [multiRooms, setMutiRooms] = useState([]);
    const [rooms, setRooms] = useState([]);
    const currentUser = useAppSelector((state) => state.auth.user);
    const currentUserId = auth.currentUser?.uid;
    const isFocus = useIsFocused();

    useEffect(() => {
        // if(isFocus)
        const q = query(
            collection(db, 'SingleRoom'),
            or(where('user1', '==', currentUserId), where('user2', '==', currentUserId)),
            orderBy('lastMessageTimestamp', 'desc'),
        );
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const rooms = [];
            const userRef = doc(db, 'User', currentUserId!);
            const user = (await getDoc(userRef)).data();
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                if (!user?.blockIds?.includes(data.user2) && !user?.blockIds?.includes(data.user1))
                    rooms.push({
                        id: doc.id,
                        type: 'single',
                        ...data,
                    });
            });
            console.log('????what');
            setSingleRooms(rooms);
        });

        const qm = query(
            collection(db, 'MultiRoom'),
            where('users', 'array-contains', currentUserId),
            // orderBy('lastMessageTimestamp', 'desc'),
        );
        const unsubscribeMuti = onSnapshot(qm, (querySnapshot) => {
            const messes = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                messes.push({
                    id: doc.id,
                    type: 'multi',
                    ...data,
                });
                console.log(data);
            });

            setMutiRooms(messes);
        });
        // const fetchRoomData = async () => {
        //     // const messageRef = collection(db, 'SingleRoom', currentRoom, 'Message')
        //     // const messageQuery = query(messageRef, orderBy('createdAt', 'asc'))

        //     //singleRoom

        //     // multiple

        //     console.log("changee")
        // };

        // fetchRoomData().catch(console.error);

        // return () => {
        //     unsubscribe()
        //     unsubscribeMuti()
        // }

        if (!isFocus) {
            console.log('unfocus');
            unsubscribe();
            unsubscribeMuti();
        }

        return () => {
            unsubscribe();
            unsubscribeMuti();
        };
    }, [isFocus]);

    useEffect(() => {
        try {
            const roomCollect = [];
            roomCollect.push(...singleRooms);
            roomCollect.push(...multiRooms);
            try {
                roomCollect.sort(function (a, b) {
                    return +b.lastMessage.createdAt.toDate() - a.lastMessage.createdAt.toDate();
                });
            } catch (e) {
                console.log(e);
            }

            setRooms(roomCollect);
        } catch (e) {
            console.error(e);
        }
    }, [singleRooms, multiRooms]);

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
                    <TouchableOpacity
                        onPress={async () => {
                            navigation.navigate(RootNavigatekey.AddToMulti, { roomId: undefined });
                        }}
                    >
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
                            {/* {userList.map((item, idx) => (
                                <TouchableOpacity onPress={() => {}}>
                                    <VStack width={16} space={1} alignItems="center" ml={idx === 0 ? 4 : 0}>
                                        <Center width={16} height={16} position="relative">
                                            <Image
                                                borderRadius={100}
                                                alt="..."
                                                width="full"
                                                height="full"
                                                source={{ uri: item.avt ?? 'yes' }}
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
                            ))} */}
                        </HStack>
                    </ScrollView>
                    <VStack space={2}>
                        {rooms.map((item, idx) => (
                            <ListItem
                                {...item}
                                key={item.id}
                                onPress={async () => {
                                    if (item.type == 'single') {
                                        navigation.navigate(RootNavigatekey.MessageDetail, {
                                            type: item.type,
                                            room: item,
                                        });
                                        // const roomCol = collection(db, "SingleRoom", item.id, "ReadUser");
                                        // addDoc(roomCol, { user: currentUserId })

                                        await updateDoc(doc(db, 'SingleRoom', item.id), {
                                            reads: arrayUnion(currentUserId),
                                        });
                                    } else {
                                        navigation.navigate(RootNavigatekey.MultiRoomMessageDetail, {
                                            type: item.type,
                                            room: item,
                                        });

                                        await updateDoc(doc(db, 'MultiRoom', item.id), {
                                            reads: arrayUnion(currentUserId),
                                        });
                                    }
                                }}
                            />
                        ))}
                    </VStack>
                </VStack>
            </ScrollView>
        </View>
    );
};
