import { BellOffIcon, EllipsisIcon, LinkIcon, LogoutIcon, TrashIcon } from "components/Icons/Light";
import { auth, db } from "config/firebase";
// import { timeAgo } from "config/timeAgo";
import { query, collection, where, documentId, getDocs, onSnapshot, Timestamp, getDoc, doc, serverTimestamp } from "firebase/firestore";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { now } from "moment";
import { HStack, VStack, Box, Text, Image, IconButton, } from "native-base";
import React from "react";
import { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";




const rightSwipeActions = () => {
    return (
        <HStack px={4} space={4} alignItems="center" bg="black" justifyContent="center">
            <IconButton borderRadius={100} bg="gray.700" icon={<LogoutIcon color="white" size="sm" />} />
            <IconButton borderRadius={100} bg="gray.700" icon={<BellOffIcon color="white" size="sm" />} />
            <IconButton borderRadius={100} bg="gray.700" icon={<LinkIcon color="white" size="sm" />} />
            <IconButton borderRadius={100} bg="gray.700" icon={<TrashIcon color="primary.900" size="sm" />} />
        </HStack>
    );
};

export const ListItem = (item: { id: string, user1: string, user2: string, reads: string[], lastMessage: string, onPress?: () => void }) => {
    const currentUserId = auth.currentUser?.uid;
    const [imgUrl, setImg] = useState("");
    const [name, setName] = useState("");
    const [lastMessage, setLastMessage] = useState("");
    const [time, setTime] = useState("")
    const [read, setRead] = useState(false)


    useEffect(() => {
        const reads = item.reads ?? []
        setRead(reads.includes(currentUserId));
    }, [item.reads])

    useEffect(() => {
        const fetchMessageData = async () => {
            const lastMessageRef = onSnapshot((doc(db, "SingleRoom", item.id)), (doc) => {
                try {
                    setLastMessage(doc.data().lastMessage.content ?? "")
                    const timeAgo = new TimeAgo('en-US');
                    console.log(doc.data().lastMessage.createdAt)
                    // let time = Date.now()
                    // if(doc.data().lastMessage.createdAt  != null){
                    setTime(timeAgo.format(doc.data().lastMessageTimestamp.toDate()))
                    // }

                    // console.log("check", doc.data().lastMessageTimestamp.toDate())
                }
                catch {
                    console.log("er")

                }

            });

        }

        fetchMessageData().catch(console.error)
    }, [item.messages])

    useEffect(() => {
        var otherUserId: string;
        if (item.user1 == currentUserId) {
            otherUserId = item.user2;
        } else {
            otherUserId = item.user1;
        }

        const fetchUserData = async () => {
            var otherUser;

            const userQuery = doc(db, "User", otherUserId);

            const textedUserSnapshot = await getDoc(userQuery);
            otherUser = textedUserSnapshot.data();
            setName(otherUser.name)
            setImg(otherUser.avatar)
        }
        fetchUserData().catch(console.error)

    }, [])

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
                                <Text
                                    bold={read ? false : true}
                                    fontSize="md"
                                    color={read ? 'gray.500' : 'black'}
                                >
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
    )
};