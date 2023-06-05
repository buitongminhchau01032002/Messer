import { FontAwesome } from '@expo/vector-icons';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import {
    BellIcon,
    EllipsisIcon,
    ImageIcon,
    MicIcon,
    NavigationIcon,
    PhoneIcon,
    VideoIcon,
} from 'components/Icons/Light';
import { TouchableOpacity } from 'components/TouchableOpacity';
import {
    Box,
    Button,
    Center,
    CloseIcon,
    Divider,
    Flex,
    HStack,
    Icon,
    IconButton,
    Input,
    KeyboardAvoidingView,
    Pressable,
    Text,
    VStack,
    useTheme,
} from 'native-base';
import { AppTabsNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, ScrollView } from 'react-native';
import { AppTabsStackScreenProps, RootStackScreenProps } from 'types';
import { MessageItem } from '../components/MessageItem';
import { Message, SendType, User } from '../type';
import { addDoc, collection, getDoc, onSnapshot, query, doc, getDocs, where, or, documentId, orderBy, Timestamp, updateDoc, arrayUnion, FieldPath, DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, serverTimestamp } from 'firebase/firestore';
import { converter, db } from 'config/firebase';

export const MessageDetailScreen = (props: RootStackScreenProps<RootNavigatekey.MessageDetail>) => {
    //navigate
    const { navigation, route } = props;
    //navigate params
    const { room } = route.params
    // hooks
    const { colors } = useTheme();
    // states
    const [quoteMessage, setQuoteMessage] = useState<Message>();
    const [content, setContent] = useState('');
    const scrollRef = useRef<ScrollView | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Set loading to true on component mount
    const [isSending, setIsSending] = useState(false); // Set loading to true on component mount
    const [messages, setMessages] = useState<Message[]>([]); // Initial empty array of users
    const [users, setUsers] = useState([])

    const curentUser = 'CPYyJYf2Rj2kUd8rCvff'
    const currentRoom = "3T7VtjOcHbbi2oTVa5gX"


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HStack space={4}>
                    <TouchableOpacity>
                        <PhoneIcon color="primary.900" size="md" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <VideoIcon color="primary.900" size="md" />
                    </TouchableOpacity>
                </HStack>
            ),
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [navigation]);



    useEffect(() => {
        console.log(1)
        const messageRef = collection(db, 'SingleRoom', currentRoom, 'Message')
        const messageQuery = query(messageRef, orderBy('createdAt', 'asc'))

        const fetchMessageData = async () => {
           
            // await fetchUserData().catch(console.error)
            let userDatas = []
            const q = query(collection(db, "User"), or(where(documentId(), '==', room.user1), where(documentId(), '==', room.user2)));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                userDatas.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            setUsers(userDatas)

            const unsub = onSnapshot(messageQuery.withConverter(converter<Message>()), async (messagesSnap) => {
                const newMessages = []
                for (const message of messagesSnap.docs) {
                    const newMessage = message.data()
                    // populate reply
                    if (newMessage.replyMessage) {
                        const replyMessage = (await getDoc(doc(messageRef, newMessage.replyMessage as string).withConverter(converter<Message>()))).data()!
                        // replyMessage.sender = (await getDoc(doc(db, 'User', replyMessage.sender as string).withConverter(converter<User>()))).data()!
                        const reply = userDatas.find((u) => u.id == replyMessage.sender)
                        replyMessage.sender = {
                            id: reply.id ,
                            avatar: reply.avatar,
                            name: reply.name
                        }

                        newMessage.replyMessage = replyMessage;
                    }
                    // // populate user
                    // newMessage.sender = (await getDoc(doc(db, 'User', newMessage.sender as string).withConverter(converter<User>()))).data()!
                    const sender = userDatas.find((u) => u.id == newMessage.sender)
                    newMessage.sender = {
                        id: sender.id ?? "",
                        avatar: sender.avatar,
                        name: sender.name
                    }
                    console.log("sender", newMessage.sender)
                    newMessages.push(newMessage)
                }
                console.log(0)
                console.log(messages)
                setMessages(newMessages)
                setIsLoading(false)
            });
        }

        fetchMessageData().catch(console.error)
        setIsLoading(true)
        return () => unsub()
    }, []);

    const handleSendMessage = (content: string) => {
        if (!content) {
            return
        }

        setIsSending(true)
        const newMessage: Message = {
            content,
            sender: curentUser,
            type: 'text',
            createdAt: serverTimestamp(),
        }
        if (quoteMessage) {
            newMessage.replyMessage = quoteMessage.id
        }

        addDoc(collection(db, 'SingleRoom', currentRoom, 'Message'), newMessage).then(values => {
            setIsSending(false)
        })
        setContent('')
        setQuoteMessage(undefined)
    }

    return (
        <Box flex={1} bg="white">
            <KeyboardAvoidingView flex={1}>
                <Box flex={1}>
                    <ScrollView
                        ref={scrollRef}
                        style={{ marginVertical: 8, marginHorizontal: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <VStack space={2}>
                            {messages.map(message =>
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    sendType={curentUser === (message.sender as User).id ? SendType.Send : SendType.Receive}
                                    onLongPress={() => {
                                        setQuoteMessage(message);
                                    }}
                                />
                            )}
                            {isLoading && <ActivityIndicator color={colors.primary[900]} />}
                        </VStack>
                    </ScrollView>
                </Box>
                <Box position="relative">
                    {quoteMessage ? (
                        <HStack
                            position="absolute"
                            bg="primary.400:alpha.90"
                            zIndex={1}
                            bottom="100%"
                            p={APP_PADDING}
                            space="sm"
                        >
                            <Divider orientation="vertical" thickness={2} bg="primary.900"></Divider>
                            <VStack flex={1} w="100%">
                                <Text bold color="white">
                                    {(quoteMessage.sender as User).name}
                                </Text>
                                <Text numberOfLines={3}>
                                    {quoteMessage.content}
                                </Text>
                            </VStack>
                            <VStack justifyContent="center" h="full">
                                <Pressable onPress={() => setQuoteMessage(undefined)}>
                                    <CloseIcon />
                                </Pressable>
                            </VStack>
                        </HStack>
                    ) : undefined}
                    <HStack p={2} px={APP_PADDING} space={4} alignItems="flex-end">
                        <TouchableOpacity px={2} py={3}>
                            <MicIcon color="primary.900" size="md" />
                        </TouchableOpacity>
                        <TouchableOpacity px={2} py={3}>
                            <ImageIcon color="primary.900" size="md" />
                        </TouchableOpacity>
                        <Input
                            value={content}
                            onChangeText={(text) => setContent(text)}
                            flex={1}
                            placeholder="Message"
                            fontSize="md"
                            bg="gray.100"
                            borderWidth={0}
                            borderRadius={20}
                            multiline
                            onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                        />
                        <TouchableOpacity px={2} py={3} disabled={isSending} onPress={() => handleSendMessage(content)}>
                            {isSending ? <ActivityIndicator color={colors.primary[900]} /> : <NavigationIcon color="primary.900" size="md" />}
                        </TouchableOpacity>
                    </HStack>
                </Box>
            </KeyboardAvoidingView>
        </Box>
    );
};

