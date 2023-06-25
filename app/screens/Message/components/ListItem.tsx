import { BellOffIcon, EllipsisIcon, LinkIcon, LogoutIcon, TrashIcon } from 'components/Icons/Light';
import { auth, db } from 'config/firebase';
// import { timeAgo } from "config/timeAgo";
import {
    query,
    collection,
    where,
    documentId,
    getDocs,
    onSnapshot,
    Timestamp,
    getDoc,
    doc,
    serverTimestamp,
    deleteDoc,
} from 'firebase/firestore';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { now } from 'moment';
import { HStack, VStack, Box, Text, Image, IconButton } from 'native-base';
import React from 'react';
import { useState, useEffect } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

export const ListItem = (item: {
    id: string;
    user1: string | null;
    user2: string | null;
    reads: string[];
    lastMessage: string;
    type: 'single' | 'multi';
    name: string | null;
    users: [] | null;
    onPress?: () => void;
}) => {
    const currentUserId = auth.currentUser?.uid;
    const [imgUrl, setImg] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2048px-Solid_white.svg.png');
    const [name, setName] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const [time, setTime] = useState('');
    const [read, setRead] = useState(false);

    const rightSwipeActions = () => {
        return (
            <HStack px={4} space={4} alignItems="center" bg="black" justifyContent="center">
                <IconButton borderRadius={100} bg="gray.700" icon={<LogoutIcon color="white" size="sm" />} />
                <IconButton borderRadius={100} bg="gray.700" icon={<BellOffIcon color="white" size="sm" />} />
                <IconButton borderRadius={100} bg="gray.700" icon={<LinkIcon color="white" size="sm" />} />
                <IconButton
                    borderRadius={100}
                    bg="gray.700"
                    icon={<TrashIcon color="primary.900" size="sm" />}
                    onPress={() => {
                        Alert.alert('Delete chat', 'You want to delete this channel?', [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: async () => await deleteDoc(doc(db, 'SingleRoom', item.id)) },
                        ]);
                    }}
                />
            </HStack>
        );
    };

    useEffect(() => {
        // set current user read
        const reads = item.reads ?? [];
        setRead(reads.includes(currentUserId));
    }, [item.reads]);

    useEffect(() => {
        const fetchMessageData = async () => {
            if (item.type == 'single') {
                const lastMessageRef = onSnapshot(doc(db, 'SingleRoom', item.id), (doc) => {
                    try {
                        //
                        setLastMessage(doc.data().lastMessage.content ?? '');
                        const timeAgo = new TimeAgo('en-US');
                        console.log(doc.data().lastMessage.createdAt);
                        setTime(timeAgo.format(doc.data().lastMessageTimestamp.toDate()));
                    } catch {
                        console.log('er');
                    }
                });
            } else {
                const lastMessageRef = onSnapshot(doc(db, 'MultiRoom', item.id), (doc) => {
                    try {
                        //
                        setLastMessage(doc.data().lastMessage.content ?? '');
                        const timeAgo = new TimeAgo('en-US');
                        console.log(doc.data().lastMessage.createdAt);
                        setTime(timeAgo.format(doc.data().lastMessageTimestamp.toDate()));
                    } catch {
                        console.log('err');
                    }
                });
            }
        };

        fetchMessageData().catch(console.error);
    }, [item.messages]);

    useEffect(() => {
        if (item.type == 'single') {
            var otherUserId: string;
            if (item.user1 == currentUserId) {
                otherUserId = item.user2;
            } else {
                otherUserId = item.user1;
            }

            const fetchUserData = async () => {
                var otherUser;

                const userQuery = doc(db, 'User', otherUserId);

                const textedUserSnapshot = await getDoc(userQuery);
                otherUser = textedUserSnapshot.data();
                setName(otherUser.name);
                setImg(otherUser.avatar);
            };
            fetchUserData().catch(console.error);
        } else {
            // const fetchUserData = async () => {
            //     const qm = query(collection(db, 'User'), where(documentId(), 'in', item.users));

            //     const usersSnap = await getDocs(qm);

            //     const userInRoom = [];
            //     usersSnap.forEach((doc) => {
            //         userInRoom.push(doc.data());
            //     });
            // };

            // fetchUserData().catch(console.error);
            setName(item.name);
        }
    }, []);

    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={rightSwipeActions} renderLeftActions={() => <View />}>
                <Pressable onPress={item.onPress}>
                    <HStack space={4} pl={4} bg="white">
                        <Image
                            alt="..."
                            source={{ uri: imgUrl }}
                            style={{ width: 64, height: 64 }}
                            borderRadius={100}
                        ></Image>
                        <VStack flex={1} space={0} justifyContent="center">
                            <HStack alignItems={'center'} space={2}>
                                <Text bold={read ? false : true} fontSize="md" color={read ? 'gray.500' : 'black'}>
                                    {name}
                                </Text>
                                {!read ? (
                                    <Box
                                        borderWidth={2}
                                        borderColor="white"
                                        borderRadius={100}
                                        width={4}
                                        height={4}
                                        bg="blue.500"
                                    ></Box>
                                ) : (
                                    <></>
                                )}
                                <Box></Box>
                            </HStack>
                            <Text isTruncated color={read ? 'gray.500' : 'black'} bold={read ? false : true}>
                                {lastMessage}
                            </Text>
                        </VStack>
                        <VStack justifyContent="center" space={2} mx={4} alignItems="flex-end">
                            <EllipsisIcon color="primary.900" size="sm" />
                            <Text color="blue.900">{time}</Text>
                        </VStack>
                    </HStack>
                </Pressable>
            </Swipeable>
        </GestureHandlerRootView>
    );
};
