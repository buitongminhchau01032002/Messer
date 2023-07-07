import { createDrawerNavigator } from '@react-navigation/drawer';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import { DropDownSelect } from 'components/DropdownSelect';
import { BallotIcon } from 'components/Icons/Solid/Ballot';
import { RulerTriangleIcon } from 'components/Icons/Solid/RulerTriangle';
import { WalletIcon } from 'components/Icons/Solid/Wallet';
import { useAppDispatch, useAppSelector } from 'hooks/index';
import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Center,
    CheckIcon,
    Container,
    Flex,
    Icon,
    IconButton,
    Pressable,
    Select,
    Text,
    useColorMode,
    VStack,
    HStack,
    Image,
    ScrollView,
    useTheme,
    Menu,
    Actionsheet,
    useDisclose,
    Toast,
} from 'native-base';
import { AppTabsNavigationKey, AuthNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import { Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { AppTabsStackScreenProps } from 'types';
import { FontAwesome } from '@expo/vector-icons';
import { NavigateScreen } from 'components/Navigate';
import { auth, db } from 'config/firebase';
import { signOut } from 'firebase/auth';
import {
    Timestamp,
    arrayRemove,
    collection,
    deleteDoc,
    doc,
    documentId,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import { BellIcon, BlockIcon, EllipsisIcon } from 'components/Icons/Light';
type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const AccountScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Account>) => {
    // navigation
    const { navigation } = props;
    const { colors } = useTheme();
    const user = useAppSelector((state) => state.auth.user);
    const [refreshing, setRefreshing] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();

    // const currentUser  = auth.currentUser?.uid
    const [currentUser, setCurrentUser] = useState({
        avatar: '',
        name: '',
        email: '',
        phone: '',
    });
    const [stories, setStories] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const init = async () => {
        console.log(user?.name);
        setCurrentUser(user);
        const storyRef = await getDocs(query(collection(db, 'User', user.id, 'Story'), orderBy('createdAt', 'desc')));
        const storiesTemp = [];
        storyRef.forEach((s) => {
            storiesTemp.push({
                id: s.id,
                ...s.data(),
            });
        });
        setStories(storiesTemp);
    };

    //story
    useEffect(() => {
        init().catch(console.error);
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await init();
        setRefreshing(false);
    }, []);

    // hooks
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HStack space={2}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootNavigatekey.InformationQR)}>
                        <Icon as={<FontAwesome />} name="hashtag" size={4} color={'blacks'} mr={2}></Icon>
                    </TouchableOpacity>
                    <Icon as={<FontAwesome />} name="list" size={4} color={'blacks'} mr={5}></Icon>
                </HStack>
            ),
        });
    }, [props.navigation]);

    const menuItem: MenuItem[] = [
        {
            title: 'Nofication',
            icon: <BellIcon size="xl" color={'primary.900'} />,
            onPress: () => navigation.navigate(RootNavigatekey.Notification),
        },
        {
            title: 'Block',
            icon: <BlockIcon size="xl" color={'primary.900'} />,
            onPress: onOpen,
        },
        // {
        //     title: 'Theme',
        //     icon: <Icon as={<FontAwesome />} name="file" size="xl" color={'primary.900'}></Icon>,
        //     onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        // },
        // {
        //     title: 'Language',
        //     icon: <Icon as={<FontAwesome />} name="globe" size="xl" color={'primary.900'}></Icon>,
        //     onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        // },
    ];
    const menuItem2: MenuItem[] = [
        {
            title: 'Direct share',
            icon: <Icon as={<FontAwesome />} name="share" size="xl" color={'primary.900'}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        },
        {
            title: 'Logout',
            icon: <Icon as={<FontAwesome />} name="logout" size="xl" color={'primary.900'}></Icon>,
            onPress: async () => {
                const docRef = doc(db, 'User', user?.id ?? '');
                await updateDoc(docRef, {
                    deviceToken: '',
                });
                signOut(auth);
            },
        },
    ];

    async function handleDelete(item: never) {
        Alert.alert('Delete chat', 'You want to delete this channel?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: async () => {
                    await deleteDoc(doc(db, 'User', item.owner.id, 'Story', item.id));
                    init();
                },
            },
        ]);
    }

    const handleUnblock = async (blockedUser: any) => {
        let targetUserId = blockedUser.id;
        console.log(blockedUser);

        const currentRef = doc(db, 'User', user?.id!);
        // update list blocked
        Toast.show({ description: `${blockedUser.name} is unblocked!` });
        onClose();
        updateDoc(currentRef, {
            blockIds: arrayRemove(targetUserId),
        });
    };

    useEffect(() => {
        console.log(user);
        const userRef = collection(db, 'User');
        let unSub: any = undefined;
        if (user?.blockIds.length === 0) {
            setBlockedUsers([]);
        } else {
            const userQuery = query(userRef, where(documentId(), 'in', user?.blockIds!));
            getDocs(userQuery).then((snapshot) => {
                snapshot.docs.forEach((doc) => setBlockedUsers((cur) => cur.concat({ id: doc.id, ...doc.data() })));
            });
        }
    }, [user]);

    return (
        <Box h="full" p={APP_PADDING} bg="white">
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <VStack space={2}>
                    <VStack space={2} mt={5} mb={10}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(RootNavigatekey.ChangeInfomation);
                            }}
                        >
                            <HStack space={2}>
                                <Image
                                    size={120}
                                    bg="primary.900"
                                    ml={5}
                                    source={{
                                        uri: currentUser.avatar ?? '',
                                    }}
                                    alt=".."
                                    borderRadius={100}
                                />
                                <VStack space={1} ml={2} justifyContent={'center'}>
                                    <Text bold fontSize="md">
                                        {currentUser.name}
                                    </Text>
                                    <Text color="gray.400">{currentUser.email}</Text>
                                    <Text color="gray.400">{currentUser.phone}</Text>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>
                    </VStack>
                    <Text fontSize="sm" my={2}>
                        Story
                    </Text>

                    <FlatList
                        numColumns={3}
                        data={stories}
                        renderItem={({ item }) => (
                            <Box height="150px" flex={1} margin={2} position={'relative'}>
                                <Image
                                    alt="..."
                                    flex={1}
                                    source={{
                                        uri: item.imageUrl,
                                    }}
                                />
                                <Text position={'absolute'} color="primary.900">
                                    {(item.createdAt as Timestamp).toDate().toLocaleDateString()}
                                </Text>
                                <HStack justifyContent={'space-between'}>
                                    <Menu
                                        mb={2}
                                        placement="top right"
                                        trigger={(triggerProps) => {
                                            return (
                                                <TouchableOpacity
                                                    p={1}
                                                    bg="gray.100"
                                                    borderRadius={100}
                                                    {...triggerProps}
                                                >
                                                    <EllipsisIcon color="primary.900" size="md" />
                                                </TouchableOpacity>
                                            );
                                        }}
                                    >
                                        <Menu.Item
                                            onPress={() => {
                                                handleDelete(item);
                                            }}
                                        >
                                            <Text bold fontSize="md" color="primary.900">
                                                Remove
                                            </Text>
                                        </Menu.Item>
                                    </Menu>
                                    <HStack>
                                        <Text color={colors.primary[900]}>{item.likedUser.length} </Text>
                                        <FontAwesome name="heart-o" size={24} color={colors.primary[900]} />
                                    </HStack>
                                </HStack>
                            </Box>
                        )}
                    />
                    <Text fontSize="sm" my={2}>
                        Setting
                    </Text>
                    <VStack space={2}>
                        {menuItem.map((m) => (
                            <NavigateScreen m={m}></NavigateScreen>
                        ))}
                    </VStack>
                    <Text fontSize="sm" my={2}>
                        Message
                    </Text>
                    <VStack space={2}>
                        {menuItem2.map((m) => (
                            <NavigateScreen m={m}></NavigateScreen>
                        ))}
                    </VStack>
                </VStack>
            </ScrollView>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <ScrollView style={{ width: '100%' }}>
                        {blockedUsers.map((bU, idx) => (
                            <HStack key={idx} padding={APP_PADDING} space={2} justifyContent="space-between">
                                <Text fontWeight="bold" textBreakStrategy="balanced">
                                    {bU.name}
                                </Text>
                                <TouchableOpacity onPress={() => handleUnblock(bU)}>
                                    <Text color="primary.900">Unblock</Text>
                                </TouchableOpacity>
                            </HStack>
                        ))}
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>
        </Box>
    );
};
