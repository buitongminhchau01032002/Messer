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
} from 'firebase/firestore';
import { auth, converter, db, storage } from 'config/firebase';
import { useAppSelector } from 'hooks/index';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Gallery } from '../components/Gallery';
import { NavigateScreen } from 'components/Navigate';
import { ResizeMode, Video } from 'expo-av';
type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const MessageManageScreen = (props: RootStackScreenProps<RootNavigatekey.MessageManage>) => {
    //navigate
    const { navigation, route } = props;
    //navigate params
    const { room } = route.params;
    // hooks
    const { colors } = useTheme();
    const { width: windowWidth } = useWindowDimensions();
    const { isOpen: isOpenImages, onOpen: onOpenImages, onClose: onCloseImages } = useDisclose();
    const { isOpen: isOpenVideos, onOpen: onOpenVideos, onClose: onCloseVideos } = useDisclose();

    // states
    const currentRoom = room.id ?? '';
    const [imageList, setImageList] = useState<Media[]>([]);
    const [videoList, setVideoList] = useState<Media[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isOpenGallary, setIsOpenGallary] = useState(false);
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
        const mediaRef = collection(db, 'SingleRoom', currentRoom, 'MediaStore');
        const mediaQuery = query(
            mediaRef,
            where('isDeleted', '!=', true),
            orderBy('isDeleted'),
            orderBy('createdAt', 'asc'),
        );

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
            title: 'Direct share',
            icon: <Icon as={<FontAwesome />} name="share" size="xl" color={'primary.900'}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
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

    return (
        <Box flex={1} bg="white">
            <KeyboardAvoidingView flex={1}>
                <ScrollView p={APP_PADDING}>
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
