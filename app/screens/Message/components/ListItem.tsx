import { current } from '@reduxjs/toolkit';
import { BellOffIcon, BlockIcon, EllipsisIcon, LinkIcon, LogoutIcon, TrashIcon } from 'components/Icons/Light';
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
    updateDoc,
    arrayUnion,
    arrayRemove,
    addDoc,
} from 'firebase/firestore';
import { useAppSelector } from 'hooks/index';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { update } from 'lodash';
import { now } from 'moment';
import { HStack, VStack, Box, Text, Image, IconButton } from 'native-base';
import React from 'react';
import { useState, useEffect } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Message } from '../type';
TimeAgo.addDefaultLocale(en);

export const ListItem = (item: {
    id: string;
    user1: string | null;
    user2: string | null;
    reads: string[];
    lastMessage: any;
    type: 'single' | 'multi';
    name: string | null;
    users: [] | null;
    onPress?: () => void;
    unnotifications: [] | null;
}) => {
    const currentUser = useAppSelector((state) => state.auth.user);

    const [imgUrl, setImg] = useState(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2048px-Solid_white.svg.png',
    );
    const [imgUrl2, setImg2] = useState(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2048px-Solid_white.svg.png',
    );
    const [name, setName] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const [time, setTime] = useState('');
    const [read, setRead] = useState(false);
    const [isUnnotify, setUnnotify] = useState(false);

    const rightSwipeActions = () => {
        return (
            <HStack px={4} space={4} alignItems="center" bg="black" justifyContent="center">
                {item.type === 'single' ? (
                    <IconButton
                        borderRadius={100}
                        bg="gray.700"
                        icon={<BlockIcon color="white" size="sm" />}
                        onPress={async () => {
                            Alert.alert(
                                'Warning',
                                "You can't see this conversation, are you sure you want block?",
                                [
                                    {
                                        text: 'OK',
                                        onPress: async () => {
                                            // const docRef = doc(db, 'SingleRoom', currentRoom, 'Message', message.id!);
                                            // updateDoc(docRef, {
                                            //     isDeleted: true,
                                            // });
                                            let targetUserId = item.user1 !== currentUser?.id ? item.user1 : item.user2;
                                            const targetUserRef = doc(db, 'User', targetUserId!);
                                            const targetSnap = await getDoc(targetUserRef);

                                            const currentRef = doc(db, 'User', currentUser?.id!);
                                            // update list blocked
                                            updateDoc(currentRef, {
                                                blockIds: arrayUnion(targetUserId),
                                            });
                                            // send message to notify blocked users
                                            const newMessage = {
                                                content: `${targetSnap.data()?.name} is blocked`,
                                                type: 'text',
                                                isDeleted: false,
                                                createdAt: serverTimestamp(),
                                            };
                                            addDoc(collection(db, 'SingleRoom', item.id, 'Message'), newMessage).then(
                                                async (values) => {
                                                    await updateDoc(doc(db, 'SingleRoom', item.id ?? ''), {
                                                        lastMessage: newMessage,
                                                        lastMessageTimestamp: newMessage.createdAt,
                                                        reads: [currentUser?.id],
                                                    });

                                                    try {
                                                        if (!item.unnotifications?.includes(targetSnap.id)) {
                                                            console.log(targetSnap?.data()?.deviceToken);
                                                            fetch('https://fcm.googleapis.com/fcm/send', {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    Authorization:
                                                                        'key=AAAAu3T5eSI:APA91bFfynL6hecTGjN4jGBUULhccdSWIBKjG0oBWefs3D5KvDu5IWHUJSJD9F3uMjhmuZbXqsUSj6GBsqRYkQgt2d2If4FUaYHy3bZ-E8NpBhqHYjsyfB9D1Nk-hxVKelYn165SqRdL',
                                                                },
                                                                body: JSON.stringify({
                                                                    to: targetSnap?.data()?.deviceToken,
                                                                    notification: {
                                                                        body: newMessage.content,
                                                                        OrganizationId: '2',
                                                                        content_available: true,
                                                                        priority: 'high',
                                                                        subtitle: 'PhotoMe',
                                                                        title: currentUser?.name.concat(' texted you'),
                                                                    },
                                                                }),
                                                            });
                                                        }
                                                    } catch (e) {
                                                        console.log(e);
                                                    }
                                                },
                                            );
                                            //
                                            const roomRef = doc(db, 'SingleRoom', item.id);
                                            updateDoc(roomRef, {
                                                user1: currentUser?.id,
                                                user2: targetUserId,
                                            });
                                        },
                                    },
                                    { text: 'Cancel', style: 'cancel' },
                                ],
                                { cancelable: true },
                            );
                        }}
                    />
                ) : (
                    <IconButton
                        borderRadius={100}
                        bg="gray.700"
                        icon={<LogoutIcon color="white" size="sm" />}
                        onPress={async () => {
                            if (item.type == 'single') {
                                await updateDoc(doc(db, 'SingleRoom', item.id), {
                                    users: arrayRemove(currentUser.id),
                                });
                            } else {
                                await updateDoc(doc(db, 'MultiRoom', item.id), {
                                    users: arrayRemove(currentUser.id),
                                });

                                const content = currentUser?.name.concat(' leave room.');

                                const newMessage = {
                                    content,
                                    sender: '',
                                    senderName: '',
                                    type: 'text',
                                    createdAt: serverTimestamp(),
                                };

                                await addDoc(collection(db, 'MultiRoom', item.id, 'Message'), newMessage).then(
                                    async () => {
                                        await updateDoc(doc(db, 'MultiRoom', item.id ?? ''), {
                                            lastMessage: newMessage,
                                            lastMessageTimestamp: newMessage.createdAt,
                                            reads: [],
                                        });
                                    },
                                );
                            }
                        }}
                    ></IconButton>
                )}
                <IconButton
                    borderRadius={100}
                    bg={isUnnotify ? 'blue.800' : 'gray.700'}
                    icon={<BellOffIcon color="white" size="sm" />}
                    onPress={async () => {
                        if (item.type == 'single') {
                            if (!isUnnotify) {
                                await updateDoc(doc(db, 'SingleRoom', item.id), {
                                    unnotifications: arrayUnion(currentUser.id),
                                });
                            } else {
                                await updateDoc(doc(db, 'SingleRoom', item.id), {
                                    unnotifications: arrayRemove(currentUser.id),
                                });
                            }
                        } else {
                            if (!isUnnotify) {
                                await updateDoc(doc(db, 'MultiRoom', item.id), {
                                    unnotifications: arrayUnion(currentUser.id),
                                });
                            } else {
                                await updateDoc(doc(db, 'MultiRoom', item.id), {
                                    unnotifications: arrayRemove(currentUser.id),
                                });
                            }
                        }
                    }}
                />
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
                            {
                                text: 'OK',
                                onPress: async () => {
                                    if (item.type == 'single') {
                                        await deleteDoc(doc(db, 'SingleRoom', item.id));
                                    } else {
                                        await deleteDoc(doc(db, 'MultiRoom', item.id));
                                    }
                                },
                            },
                        ]);
                    }}
                />
            </HStack>
        );
    };

    useEffect(() => {
        // set current user read
        const reads = item.reads ?? [];
        setRead(reads.includes(currentUser.id));
    }, [item.reads]);

    useEffect(() => {
        const unnotifies = item.unnotifications ?? [];
        setUnnotify(unnotifies.includes(currentUser.id));
    }, [item.unnotifications]);

    useEffect(() => {
        const timeAgo = new TimeAgo('en-US');
        try {
            if (item.type == 'single') {
                setLastMessage(item.lastMessage.content);
                setTime(timeAgo.format(item.lastMessage.createdAt.toDate()));
            } else {
                setLastMessage(item.lastMessage.senderName.concat(': ').concat(item.lastMessage.content));
                setTime(timeAgo.format(item.lastMessage.createdAt.toDate()));
            }
        } catch (e) {
            console.log(e);
        }
    }, [item.lastMessage]);

    useEffect(() => {
        if (item.type == 'single') {
            var otherUserId: string;
            if (item.user1 == currentUser.id) {
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
            const fetchUserData = async () => {
                setName(item.name);

                const q = query(collection(db, 'User'), where(documentId(), 'in', item.users));
                const userList = [];
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    userList.push(doc.data());
                });
                setImg(userList[0].avatar);
                setImg2(userList[1].avatar);
            };
            fetchUserData().catch(console.error);
        }
    }, []);

    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={rightSwipeActions} renderLeftActions={() => <View />}>
                <Pressable onPress={item.onPress}>
                    <HStack space={4} pl={4} bg="white">
                        {item.type == 'single' ? (
                            <Image
                                alt="..."
                                source={{ uri: imgUrl }}
                                style={{ width: 64, height: 64 }}
                                borderRadius={100}
                            ></Image>
                        ) : (
                            <Box position={'relative'} width={63} height={63}>
                                <Image
                                    position={'absolute'}
                                    alt="..."
                                    source={{ uri: imgUrl2 }}
                                    style={{ width: 48, height: 48 }}
                                    borderRadius={100}
                                    right={0}
                                    top={0}
                                />
                                <Image
                                    position={'absolute'}
                                    alt="..."
                                    source={{ uri: imgUrl }}
                                    left={0}
                                    bottom={0}
                                    style={{ width: 48, height: 48 }}
                                    borderRadius={100}
                                />
                            </Box>
                        )}

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
