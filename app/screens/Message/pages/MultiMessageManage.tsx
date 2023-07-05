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
    ScrollView,
    Image,
} from 'native-base';
import { AppTabsNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
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
    arrayRemove,
} from 'firebase/firestore';
import { auth, converter, db, storage } from 'config/firebase';
import { useAppSelector } from 'hooks/index';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Gallery } from '../components/Gallery';
import { NavigateScreen } from 'components/Navigate';
import { ResizeMode, Video } from 'expo-av';
import Dialog from 'react-native-dialog';
import { localImages } from 'app/constants/Images';
type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const MultiMessageManageScreen = (props: RootStackScreenProps<RootNavigatekey.MultiMessageManage>) => {
    //navigate
    const { navigation, route } = props;
    //navigate params
    const { room } = route.params;
    // hooks
    const { colors } = useTheme();
    const { width: windowWidth } = useWindowDimensions();
    const { isOpen: isOpenImages, onOpen: onOpenImages, onClose: onCloseImages } = useDisclose();
    const { isOpen: isOpenVideos, onOpen: onOpenVideos, onClose: onCloseVideos } = useDisclose();
    const { isOpen: isOpenMembers, onOpen: onOpenMembers, onClose: onCloseMembers } = useDisclose();
    const [nameDialogVisible, setNameDialogVisible] = useState(false);
    const [roomImage, setRoomImage] = useState('');
    const currentUser = useAppSelector((state) => state.auth.user);

    // states
    const currentRoom = room.id ?? '';
    const [imageList, setImageList] = useState<Media[]>([]);
    const [videoList, setVideoList] = useState<Media[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isOpenGallary, setIsOpenGallary] = useState(false);
    const [users, setUser] = useState([]);
    const [roomNameChange, setRoomNameChange] = useState('');
    const [roomName, setRoomName] = useState('');
    // consts
    const spacing = 0;
    const calcImageWidth = (cols: number, spacing: number) => {
        return (windowWidth - 16 - spacing * 4 * (cols - 1)) / cols;
    };
    const [imgWidth] = useState(calcImageWidth(3, spacing));

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Manage',
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [navigation]);

    useEffect(() => {
        const mediaRef = collection(db, 'MultiRoom', currentRoom, 'MediaStore');
        const mediaQuery = query(mediaRef, orderBy('createdAt', 'asc'));

        const fetchPinnedMessage = async () => {
            const unsub = onSnapshot(mediaQuery.withConverter(converter<Media>()), async (mediaSnap) => {
                const images: Media[] = [];
                const videos: Media[] = [];
                mediaSnap.forEach((media) => {
                    const doc = media.data();
                    if (doc.type === 'image') {
                        images.push({ id: media.id, ...doc });
                    } else {
                        videos.push({ id: media.id, ...doc });
                    }
                });
                setImageList(images);
                setVideoList(videos);
            });
        };

        fetchPinnedMessage().catch(console.error);

        const fetchUserData = async () => {
            const q = query(collection(db, 'User'), where(documentId(), 'in', room.users));
            const userList = [];
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                userList.push({ id: doc.id, ...doc.data() });
            });
            setUser(userList);
        };
        fetchUserData().catch(console.error);

        setRoomImage(room.image ?? '');
        setRoomName(room.name);
        setRoomNameChange(room.name);
        // return () => unsub()
    }, []);

    const mediaItems: MenuItem[] = [
        {
            title: 'Images',
            icon: <ImageIcon size="xl" color={'primary.900'} />,
            onPress: onOpenImages,
        },
        {
            title: 'Videos',
            icon: <VideoIcon size="xl" color={'primary.900'} />,
            onPress: onOpenVideos,
        },
    ];
    const infoItems: MenuItem[] = [
        {
            title: 'Member',
            icon: <Icon as={<FontAwesome />} name="user" size="xl" color={'primary.900'}></Icon>,
            onPress: onOpenMembers,
        },
        {
            title: 'Nofication',
            icon: <Icon as={<FontAwesome />} name="bell" size="xl" color={'primary.900'} />,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        },
        {
            title: 'Pricacy and Security',
            icon: <Icon as={<FontAwesome />} name="shield" size="xl" color={'primary.900'} />,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        },
        {
            title: 'Theme',
            icon: <Icon as={<FontAwesome />} name="file" size="xl" color={'primary.900'}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        },
        {
            title: 'Language',
            icon: <Icon as={<FontAwesome />} name="globe" size="xl" color={'primary.900'}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        },
    ];

    const handleCloseGallery = () => {
        setActiveIndex(0);
        setIsOpenGallary(false);
    };
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            // setImageUrl(result.assets[0].uri);
            const roomRef = doc(db, 'MultiRoom', room.id ?? '');

            const imgResponse = await fetch(result.assets[0].uri);
            const blob = await imgResponse.blob();
            const name = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf('/') + 1);
            const storageRef = ref(storage, 'images/'.concat(name));

            uploadBytes(storageRef, blob).then((snapshot) => {
                getDownloadURL(storageRef).then(async (url) => {
                    await updateDoc(roomRef, {
                        image: url,
                    });
                    setRoomImage(url);
                });
            });
        }
    };

    const changeRoomName = async () => {
        const roomRef = doc(db, 'MultiRoom', room.id ?? '');
        await updateDoc(roomRef, {
            name: roomNameChange,
        });
        setRoomName(roomNameChange);
        console.log(roomNameChange);
        setNameDialogVisible(false);
    };

    async function handleRemoveUser(u: any) {
        const roomRef = doc(db, 'MultiRoom', room.id ?? '');
        await updateDoc(roomRef, {
            users: arrayRemove(u.id),
        });
        setUser(
            users.filter((e) => {
                return e.id != u.id;
            }),
        );
        // console.log(u)
    }

    return (
        <Box flex={1} bg="white">
            <Dialog.Container visible={nameDialogVisible}>
                <Dialog.Title>Enter Room Name</Dialog.Title>
                <Dialog.Input onChangeText={(t) => setRoomNameChange(t)} />
                <Dialog.Button
                    label="Cancel"
                    onPress={() => {
                        setNameDialogVisible(false);
                    }}
                />
                <Dialog.Button
                    label="Change"
                    onPress={() => {
                        changeRoomName();
                    }}
                />
            </Dialog.Container>
            <KeyboardAvoidingView flex={1}>
                <ScrollView p={APP_PADDING}>
                    <Center>
                        <TouchableOpacity onPress={pickImage}>
                            <VStack space={2}>
                                <Center>
                                    {roomImage != '' ? (
                                        <Image
                                            source={{ uri: roomImage }}
                                            fallbackSource={localImages.driverPlaceHoder}
                                            style={{ width: 100, height: 100 }}
                                            alt="..."
                                            borderRadius={100}
                                        ></Image>
                                    ) : (
                                        <Box position={'relative'} width={100} height={100}>
                                            <Image
                                                position={'absolute'}
                                                alt="..."
                                                source={{ uri: users[0]?.avatar ?? '' }}
                                                style={{ width: 80, height: 80 }}
                                                borderRadius={100}
                                                right={0}
                                                top={0}
                                            />
                                            <Image
                                                position={'absolute'}
                                                alt="..."
                                                source={{ uri: users[1]?.avatar ?? '' }}
                                                left={0}
                                                bottom={0}
                                                style={{ width: 80, height: 80 }}
                                                borderRadius={100}
                                            />
                                        </Box>
                                    )}
                                    {/* <Image
                                        source={imageUrl ? { uri: imageUrl } : localImages.avatarPlaceholder}
                                        fallbackSource={localImages.driverPlaceHoder}
                                        style={{ width: 100, height: 100 }}
                                        alt="..."
                                        borderRadius={100}
                                    ></Image> */}
                                </Center>
                            </VStack>
                        </TouchableOpacity>
                        <VStack space={2} ml={2} alignItems="center">
                            <Pressable onPress={() => setNameDialogVisible(true)}>
                                <Text bold fontSize={26}>
                                    {roomName}
                                </Text>
                            </Pressable>
                        </VStack>
                    </Center>
                    <Text fontSize="sm" my={2}>
                        Media
                    </Text>
                    <VStack space={2}>
                        {mediaItems.map((m) => (
                            <NavigateScreen m={m}></NavigateScreen>
                        ))}
                    </VStack>
                    <Text fontSize="sm" my={2}>
                        Message
                    </Text>
                    <VStack space={2}>
                        {infoItems.map((m) => (
                            <NavigateScreen m={m}></NavigateScreen>
                        ))}
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
            <Actionsheet isOpen={isOpenVideos} onClose={onCloseVideos}>
                <Actionsheet.Content>
                    <ScrollView style={{ width: '100%' }}>
                        <HStack flexWrap="wrap" space={spacing}>
                            {videoList.map((v, idx) => (
                                <Box bg="black">
                                    <Video
                                        key={idx}
                                        style={{ width: imgWidth, height: imgWidth }}
                                        source={{
                                            uri: v.url,
                                        }}
                                        useNativeControls
                                        resizeMode={ResizeMode.CONTAIN}
                                    />
                                </Box>
                            ))}
                        </HStack>
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>
            <Actionsheet isOpen={isOpenImages} onClose={onCloseImages}>
                <Actionsheet.Content>
                    <ScrollView style={{ width: '100%' }}>
                        <HStack flexWrap="wrap" space={spacing}>
                            {imageList.map((i, idx) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setActiveIndex(idx);
                                        setIsOpenGallary(true);
                                    }}
                                    key={i.id}
                                    w={imgWidth}
                                    h={imgWidth}
                                    position="relative"
                                    bg="black"
                                >
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderWidth: 1,
                                            borderColor: 'primary.900',
                                        }}
                                        src={i.url}
                                        alt="..."
                                    />
                                </TouchableOpacity>
                            ))}
                        </HStack>
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>
            <Actionsheet isOpen={isOpenMembers} onClose={onCloseMembers}>
                <Actionsheet.Content>
                    <ScrollView style={{ width: '100%' }}>
                        <VStack space={spacing}>
                            <Pressable
                                alignSelf={'flex-end'}
                                bg={'primary.900'}
                                padding={2}
                                onPress={() => {
                                    navigation.navigate(RootNavigatekey.AddToMulti, { room: room });
                                    handleCloseGallery()
                                }}
                            >
                                <Text fontWeight="bold" textBreakStrategy="balanced">
                                    Add member
                                </Text>
                            </Pressable>
                            {users.map((u, idx) => (
                                <HStack
                                    key={idx}
                                    padding={APP_PADDING}
                                    space={2}
                                    justifyContent="space-between"
                                    alignItems={'center'}
                                >
                                    <HStack space={2} alignItems={'center'}>
                                        <Image
                                            alt="..."
                                            source={{ uri: u.avatar }}
                                            style={{ width: 64, height: 64 }}
                                            borderRadius={100}
                                        />
                                        <Text fontWeight="bold" textBreakStrategy="balanced">
                                            {u.name}
                                        </Text>
                                    </HStack>
                                    {u.id != currentUser?.id ? (
                                        <Pressable
                                            onPress={() => {
                                                handleRemoveUser(u);
                                            }}
                                        >
                                            <Text color="primary.900">Remove</Text>
                                        </Pressable>
                                    ) : (
                                        <></>
                                    )}
                                </HStack>
                            ))}
                        </VStack>
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>
            <Gallery
                key={activeIndex}
                isOpen={isOpenGallary}
                onClose={handleCloseGallery}
                initIndex={activeIndex}
                images={imageList}
            />
        </Box>
    );
};
