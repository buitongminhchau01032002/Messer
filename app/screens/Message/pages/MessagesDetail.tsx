import { FontAwesome } from '@expo/vector-icons';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import {
    BellIcon,
    CameraIcon,
    EllipsisIcon,
    ImageIcon,
    MicIcon,
    NavigationIcon,
    PhoneIcon,
    VideoIcon,
} from 'components/Icons/Light';
import { TouchableOpacity } from 'components/TouchableOpacity';
import {
    Actionsheet,
    Box,
    Button,
    Center,
    ChevronDownIcon,
    CloseIcon,
    Divider,
    Flex,
    HStack,
    Icon,
    IconButton,
    Input,
    KeyboardAvoidingView,
    Menu,
    Pressable,
    Text,
    VStack,
    useDisclose,
    useTheme,
} from 'native-base';
import { AppTabsNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Platform, ScrollView } from 'react-native';
import { AppTabsStackScreenProps, RootStackScreenProps } from 'types';
import { MessageItem } from '../components/MessageItem';
import { Media, Message, SendType, User } from '../type';
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
    FieldPath,
    DocumentData,
    QueryDocumentSnapshot,
    SnapshotOptions,
    WithFieldValue,
    serverTimestamp,
    setDoc,
    deleteDoc,
} from 'firebase/firestore';
import { auth, converter, db, storage } from 'config/firebase';
import { useAppSelector } from 'hooks/index';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Gallery } from '../components/Gallery';

export const MessageDetailScreen = (props: RootStackScreenProps<RootNavigatekey.MessageDetail>) => {
    //navigate
    const { navigation, route } = props;
    //navigate params
    const { room } = route.params;
    // hooks
    const { colors } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclose();
    // states
    const currentUser = useAppSelector((state) => state.auth.user);
    const [quoteMessage, setQuoteMessage] = useState<Message>();
    const [content, setContent] = useState('');
    const scrollRef = useRef<ScrollView | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Set loading to true on component mount
    const [isSending, setIsSending] = useState(false); // Set loading to true on component mount
    const [messages, setMessages] = useState<Message[]>([]); // Initial empty array of users
    const [users, setUsers] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState<
        (Pick<Message, 'content' | 'id'> & { _id: string; thumb?: string })[]
    >([]);
    const [isLoadingPinnedMessage, setIsLoadingPinnedMessage] = useState(true);
    const [isPinning, setIsPinning] = useState(false);
    const [isUpFile, setIsUpFile] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isOpenGallary, setIsOpenGallary] = useState(false);
    const [curGallary, setCurGallary] = useState<Media[]>([]);
    const [notCurrentUser, setNotCurrentUser] = useState(null);
    const [targetUser, setTargetUser] = useState(null);

    // const curentUser = 'CPYyJYf2Rj2kUd8rCvff'\
    // const currentRoom = "3T7VtjOcHbbi2oTVa5gX"
    const currentRoom = room.id ?? '';

    // console.log()

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                // Chau: some style and navigate to call screen
                <HStack>
                    {!targetUser?.blockIds?.includes(currentUser?.id) ? (
                        <IconButton
                            onPress={() => {
                                const otherUser = users.find((e) => e.id !== currentUser?.id);
                                console.log('other user', otherUser);
                                props.navigation.navigate(RootNavigatekey.CallWaiting, {
                                    toUser: otherUser,
                                    type: 'no-video',
                                });
                            }}
                            icon={<PhoneIcon color="primary.900" size="md" />}
                        />
                    ) : (
                        <></>
                    )}
                    {!targetUser?.blockIds?.includes(currentUser?.id) ? (
                        <IconButton
                            onPress={() => {
                                const otherUser = users.find((e) => e.id !== currentUser?.id);
                                console.log('other user', otherUser);
                                props.navigation.navigate(RootNavigatekey.CallWaiting, {
                                    toUser: otherUser,
                                    type: 'video',
                                });
                            }}
                            icon={<VideoIcon color="primary.900" size="xl" />}
                        />
                    ) : (
                        <></>
                    )}
                    <IconButton
                        onPress={() => navigation.navigate(RootNavigatekey.MessageManage, route.params)}
                        icon={<EllipsisIcon color="primary.900" size="md" />}
                    />
                </HStack>
            ),
            // headerTitle: notCurrentUser?.name??"",
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [navigation, users]);

    useEffect(() => {
        const messageRef = collection(db, 'SingleRoom', currentRoom, 'Message');
        const messageQuery = query(messageRef, orderBy('createdAt', 'asc'));

        const pinnedMessageRef = collection(db, 'SingleRoom', currentRoom, 'PinMessage');
        const pinnedMessageQuery = query(pinnedMessageRef, orderBy('createdAt', 'asc'));

        const fetchMessageData = async () => {
            // await fetchUserData().catch(console.error)
            let userDatas = [];
            const q = query(
                collection(db, 'User'),
                or(where(documentId(), '==', room.user1), where(documentId(), '==', room.user2)),
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                userDatas.push({
                    id: doc.id,
                    ...doc.data(),
                });
                if (doc.id != currentUser.id) {
                    navigation.setOptions({
                        headerTitle: doc.data().name,
                    });
                    setTargetUser({ id: doc.id, ...doc.data() });
                }
            });
            setUsers(userDatas);
            // setNotCurrentUser(userDatas.find((e) => e.id !== currentUser?.id))

            const unsub = onSnapshot(messageQuery.withConverter(converter<Message>()), async (messagesSnap) => {
                const newMessages = [];
                for (const message of messagesSnap.docs) {
                    const newMessage = { id: message.id, ...message.data() };
                    // populate reply
                    if (newMessage.replyMessage) {
                        const replyMessage = (
                            await getDoc(
                                doc(messageRef, newMessage.replyMessage as string).withConverter(converter<Message>()),
                            )
                        ).data()!;
                        const reply = userDatas.find((u) => u.id == replyMessage.sender);
                        replyMessage.sender = {
                            id: reply.id,
                            avatar: reply.avatar,
                            name: reply.name,
                        };

                        newMessage.replyMessage = replyMessage;
                    }
                    // // populate user
                    const sender = userDatas.find((u) => u.id == newMessage.sender);
                    newMessage.sender = sender
                        ? {
                            id: sender?.id ?? '',
                            avatar: sender?.avatar,
                            name: sender?.name,
                        }
                        : undefined;
                    newMessages.push(newMessage);
                }
                setMessages(newMessages);
                setIsLoading(false);
            });
        };

        const fetchPinnedMessage = async () => {
            const unsub = onSnapshot(
                pinnedMessageQuery.withConverter(converter<Pick<Message, 'content' | 'id'>>()),
                async (messagesSnap) => {
                    setPinnedMessages(messagesSnap.docs.map((mes) => ({ _id: mes.id, ...mes.data() })));
                    setIsLoadingPinnedMessage(false);
                },
            );
        };

        fetchMessageData().catch((e) => {
            console.warn(e);
            setIsLoading(false);
        });
        fetchPinnedMessage().catch((e) => {
            console.warn(e);
            setIsLoadingPinnedMessage(false);
        });
        setIsLoading(true);
        setIsLoadingPinnedMessage(true);
        // return () => unsub()
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollToEnd();
    }, [messages.length]);

    const handleSendMessage = (content: string, type?: string) => {
        if (!content) {
            return;
        }

        setIsSending(true);
        const newMessage: Message = {
            content,
            sender: currentUser.id,
            type: type ?? 'text',
            isDeleted: false,
            createdAt: serverTimestamp(),
        };
        if (quoteMessage) {
            newMessage.replyMessage = quoteMessage.id;
        }

        addDoc(collection(db, 'SingleRoom', currentRoom, 'Message'), newMessage).then(async (values) => {
            setIsSending(false);
            // send notification

            const receiver = users.find((u) => u.id != newMessage.sender);
            const sender = users.find((u) => u.id == newMessage.sender);

            await updateDoc(doc(db, 'SingleRoom', room.id ?? ''), {
                lastMessage: newMessage,
                lastMessageTimestamp: newMessage.createdAt,
                reads: [currentUser.id],
            });
            console.log(room.unnotifications);

            try {
                if (!room.unnotifications?.includes(receiver.id)) {
                    console.log(receiver.deviceToken);
                    fetch('https://fcm.googleapis.com/fcm/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                'key=AAAA_NhSjHE:APA91bG6cuT7eAiPJEz59D1bG9QaC-0F-UEKLt16bIGz29Q7LPZuoWmQFHldzhVuJthqv6ozkVwN3n7Cz1IKYmsQ7u-SbjgxVnOD83kzI6qtESYP0o5FcwCDkUqOXKieo8DDiBiQUihv',
                        },
                        body: JSON.stringify({
                            to: receiver.deviceToken,
                            notification: {
                                body: newMessage.content,
                                OrganizationId: '2',
                                content_available: true,
                                priority: 'high',
                                subtitle: 'PhotoMe',
                                title: sender.name.concat(' texted you'),
                               
                            },
                            data: {
                                type: 'single',
                                idRoom: room.id
                            }

                        }),
                    });
                }
            } catch (e) {
                console.log(e);
            }
        });
        setContent('');
        setQuoteMessage(undefined);
    };
    //         fetch('https://fcm.googleapis.com/fcm/send', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization:
    //                     'key=AAAAu3T5eSI:APA91bFfynL6hecTGjN4jGBUULhccdSWIBKjG0oBWefs3D5KvDu5IWHUJSJD9F3uMjhmuZbXqsUSj6GBsqRYkQgt2d2If4FUaYHy3bZ-E8NpBhqHYjsyfB9D1Nk-hxVKelYn165SqRdL',
    //             },
    //             body: JSON.stringify({
    //                 to: receiver.deviceToken,
    //                 notification: {
    //                     body: newMessage.content,
    //                     OrganizationId: '2',
    //                     content_available: true,
    //                     priority: 'high',
    //                     subtitle: 'PhotoMe',
    //                     title: sender.name.concat(' texted you'),
    //                 },
    //             }),
    //         });
    //     });
    //     setContent('');
    //     setQuoteMessage(undefined);
    // };

    const handlePinMessage = (message: Message) => {
        setIsPinning(true);
        addDoc(collection(db, 'SingleRoom', currentRoom, 'PinMessage'), {
            id: message.id,
            content: message.content,
            isDeleted: false,
            createdAt: serverTimestamp(),
        }).then(async (values) => {
            setIsPinning(false);
        });
    };

    const handleUnpinMessage = (id: string) => {
        setIsPinning(true);
        deleteDoc(doc(db, 'SingleRoom', currentRoom, 'PinMessage', id)).then(async (values) => {
            setIsPinning(false);
        });
    };

    const handleUploadFileFromLib = async () => {
        // No permissions request is necessary for launching the image library
        setIsUpFile(true);
        setIsSending(true);
        const links: { url: string; type: string; thumb?: string }[] = [];
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 1,
        });
        if (!result.canceled) {
            const uploadFiles = result.assets.map(async (asset) => {
                const imgResponse = await fetch(asset.uri);
                const blob = await imgResponse.blob();
                const name = asset.fileName ?? new Date().valueOf().toString();
                const storageRef = ref(storage, `${asset.type}s/`.concat(name));
                await uploadBytes(storageRef, blob);
                const url = await getDownloadURL(storageRef);
                links.push({ url: url, type: asset.type ?? 'image' });
                // if (asset.type === 'video') {
                //     try {
                //         console.log(VideoThumbnails);
                //         const { uri: thumb } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
                //             time: 0,
                //         });
                //         links.push({ url: url, type: asset.type ?? 'image', thumb });
                //     } catch (e) {
                //         console.warn(e);
                //         return;
                //     }
                // } else if (asset.type === 'image') {
                // } else {
                //     return;
                // }
            });
            await Promise.all(uploadFiles);
            links.forEach((link) =>
                addDoc(collection(db, 'SingleRoom', currentRoom, 'MediaStore'), {
                    url: link.url,
                    type: link.type,
                    isDeleted: false,
                    createdAt: serverTimestamp(),
                }),
            );
            handleSendMessage(JSON.stringify(links), 'media');
        } else {
            setIsSending(false);
        }
        setIsUpFile(false);
    };

    const handleUploadFileFromCamera = async (mediaType: ImagePicker.MediaTypeOptions) => {
        // No permissions request is necessary for launching the image library
        setIsUpFile(true);
        setIsSending(true);
        const links: Media[] = [];
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: mediaType,
            quality: 1,
        });
        if (!result.canceled) {
            const uploadFiles = result.assets.map(async (asset) => {
                const imgResponse = await fetch(asset.uri);
                const blob = await imgResponse.blob();
                const name = asset.fileName ?? new Date().valueOf().toString();
                const storageRef = ref(storage, `${asset.type}s/`.concat(name));
                await uploadBytes(storageRef, blob);
                const url = await getDownloadURL(storageRef);
                links.push({ url: url, type: asset.type ?? 'image' });
                // if (asset.type === 'video') {
                //     try {
                //         console.log(VideoThumbnails);
                //         const { uri: thumb } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
                //             time: 0,
                //         });
                //         links.push({ url: url, type: asset.type ?? 'image', thumb });
                //     } catch (e) {
                //         console.warn(e);
                //         return;
                //     }
                // } else if (asset.type === 'image') {
                // } else {
                //     return;
                // }
            });
            await Promise.all(uploadFiles);
            links.forEach((link) =>
                addDoc(collection(db, 'SingleRoom', currentRoom, 'MediaStore'), {
                    url: link.url,
                    type: link.type,
                    isDeleted: false,
                    createdAt: serverTimestamp(),
                }),
            );
            handleSendMessage(JSON.stringify(links), 'media');
        } else {
            setIsSending(false);
        }
        setIsUpFile(false);
    };

    const handleDeleteMessage = (message: Message) => {
        Alert.alert(
            'Warning',
            "Can't restore after delete, are you sure you want delete?",
            [
                {
                    text: 'OK',
                    onPress: async () => {
                        const docRef = doc(db, 'SingleRoom', currentRoom, 'Message', message.id!);
                        updateDoc(docRef, {
                            isDeleted: true,
                        });
                        if (message.type === 'media') {
                            const mediaList = JSON.parse(message.content!) as Media[];
                            const querySnapshot = await getDocs(
                                collection(db, 'SingleRoom', currentRoom, 'MediaStore'),
                            );
                            querySnapshot.forEach((snap) => {
                                if (mediaList.find((m) => m.url === snap.data().url)) {
                                    const mediaRef = doc(db, 'SingleRoom', currentRoom, 'MediaStore', snap.id);
                                    updateDoc(mediaRef, {
                                        isDeleted: true,
                                    });
                                }
                            });
                        }
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true },
        );
    };

    const handleCloseGallery = () => {
        setActiveIndex(0);
        setIsOpenGallary(false);
    };

    return (
        <Box flex={1} bg="white">
            <KeyboardAvoidingView flex={1}>
                <Box flex={1} position="relative">
                    {!isLoadingPinnedMessage && pinnedMessages.length > 0 && (
                        <Box bg="amber.100:alpha.90" w="100%" zIndex={1} p={APP_PADDING / 2} px={4} position="absolute">
                            <HStack alignItems="center" justifyContent="space-between">
                                <HStack alignItems="center" space={2}>
                                    <Text>{pinnedMessages[pinnedMessages.length - 1]?.content}</Text>
                                    {pinnedMessages.length > 1 && (
                                        <Text color="primary.900">+{pinnedMessages.length - 1}</Text>
                                    )}
                                    {isPinning && <ActivityIndicator color={colors.primary[900]} />}
                                </HStack>
                                <IconButton
                                    onPress={onOpen}
                                    borderRadius="full"
                                    icon={<ChevronDownIcon />}
                                ></IconButton>
                            </HStack>
                        </Box>
                    )}
                    <ScrollView
                        ref={scrollRef}
                        style={{ marginVertical: 8, marginHorizontal: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <VStack space={2}>
                            {messages.map((message) => {
                                const pinnedMessage = pinnedMessages.find((m) => m.id === message.id);
                                return (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        isPinned={pinnedMessage ? true : false}
                                        sendType={
                                            !message.sender
                                                ? SendType.Notice
                                                : currentUser.id === (message.sender as User).id
                                                    ? SendType.Send
                                                    : SendType.Receive
                                        }
                                        onQuote={() => {
                                            setQuoteMessage(message);
                                        }}
                                        onPin={() =>
                                            pinnedMessage
                                                ? handleUnpinMessage(pinnedMessage._id)
                                                : handlePinMessage(message)
                                        }
                                        onPressImage={(idx, gallary) => {
                                            setActiveIndex(idx);
                                            setCurGallary(gallary);
                                            setIsOpenGallary(true);
                                        }}
                                        onDelete={() => handleDeleteMessage(message)}
                                        isDeleted={message.isDeleted}
                                    />
                                );
                            })}
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
                                {quoteMessage.type === 'text' ? (
                                    <Text numberOfLines={3}>{quoteMessage.content}</Text>
                                ) : (
                                    <Text numberOfLines={3} fontWeight="bold">
                                        Media
                                    </Text>
                                )}
                            </VStack>
                            <VStack justifyContent="center" h="full">
                                <Pressable onPress={() => setQuoteMessage(undefined)}>
                                    <CloseIcon />
                                </Pressable>
                            </VStack>
                        </HStack>
                    ) : undefined}
                    <HStack p={2} px={APP_PADDING} space={4} alignItems="flex-end">
                        <TouchableOpacity px={2} py={3} onPress={handleUploadFileFromLib} disabled={isUpFile}>
                            {isUpFile ? (
                                <ActivityIndicator color={colors.primary[900]} />
                            ) : (
                                <ImageIcon color="primary.900" size="md" />
                            )}
                        </TouchableOpacity>

                        <Menu
                            w="190"
                            trigger={(triggerProps) => {
                                return (
                                    <TouchableOpacity px={2} py={3} {...triggerProps}>
                                        {isUpFile ? (
                                            <ActivityIndicator color={colors.primary[900]} />
                                        ) : (
                                            <CameraIcon color="primary.900" size="md" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        >
                            <Menu.Item onPress={() => handleUploadFileFromCamera(ImagePicker.MediaTypeOptions.Images)}>
                                Image
                            </Menu.Item>
                            <Menu.Item onPress={() => handleUploadFileFromCamera(ImagePicker.MediaTypeOptions.Videos)}>
                                Video
                            </Menu.Item>
                        </Menu>
                        <Input
                            value={content}
                            onChangeText={(text) => setContent(text)}
                            flex={1}
                            placeholder={
                                targetUser?.blockIds?.includes(currentUser?.id) ? 'You are blocked' : 'Message'
                            }
                            fontSize="md"
                            bg="gray.100"
                            borderWidth={0}
                            borderRadius={20}
                            multiline
                            isDisabled={targetUser?.blockIds?.includes(currentUser?.id)}
                            onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                        />
                        <TouchableOpacity px={2} py={3} disabled={isSending} onPress={() => handleSendMessage(content)}>
                            {isSending ? (
                                <ActivityIndicator color={colors.primary[900]} />
                            ) : (
                                <NavigationIcon color="primary.900" size="md" />
                            )}
                        </TouchableOpacity>
                    </HStack>
                </Box>
            </KeyboardAvoidingView>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <ScrollView style={{ width: '100%' }}>
                        {pinnedMessages.map((pM, idx) => (
                            <HStack key={idx} padding={APP_PADDING} space={2} justifyContent="space-between">
                                <Text fontWeight="bold" textBreakStrategy="balanced">
                                    {pM.content}
                                </Text>
                                <Pressable onPress={() => {handleUnpinMessage(pM._id)}}>
                                    <Text color="primary.900">Unpin</Text>
                                </Pressable>
                            </HStack>
                        ))}
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>
            <Gallery
                key={activeIndex}
                isOpen={isOpenGallary}
                onClose={handleCloseGallery}
                initIndex={activeIndex}
                images={curGallary}
            />
        </Box>
    );
};
