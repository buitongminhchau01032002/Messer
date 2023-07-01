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
} from 'native-base';
import { AppTabsNavigationKey, AuthNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import { TouchableOpacity } from 'react-native';
import { AppTabsStackScreenProps } from 'types';
import { FontAwesome } from '@expo/vector-icons';
import { NavigateScreen } from 'components/Navigate';
import { auth, db } from 'config/firebase';
import { signOut } from 'firebase/auth';
import { Timestamp, collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
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
    // const currentUser  = auth.currentUser?.uid
    const [currentUser, setCurrentUser] = useState({
        avatar: '',
        name: '',
        email: '',
        phone: '',
    });
    const [stories, setStories] = useState([]);

    useEffect(() => {
        console.log(user);
        setCurrentUser(user);
    }, []);

    //story
    useEffect(() => {
        const getStory = async () => {
            const storyRef = await getDocs(collection(db, 'User', user.id, 'Story'));
            const storiesTemp = [];
            storyRef.forEach((s) => {
                storiesTemp.push(s.data());
            });
            setStories(storiesTemp);
            console.log(storiesTemp);
        };

        getStory().catch(console.error);
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
    const menuItem2: MenuItem[] = [
        {
            title: 'Direct share',
            icon: <Icon as={<FontAwesome />} name="share" size="xl" color={'primary.900'}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        },
        {
            title: 'Logout',
            icon: <Icon as={<FontAwesome />} name="logout" size="xl" color={'primary.900'}></Icon>,
            onPress: () => {
                signOut(auth);
            },
        },
    ];

    return (
        <Box h="full" p={APP_PADDING} bg="white">
            <ScrollView>
                <VStack space={2}>
                    <VStack space={2} mt={5} mb={10}>
                        <TouchableOpacity>
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
                                    flex={1}
                                    source={{
                                        uri: item.imageUrl,
                                    }}
                                />
                                <Text position={'absolute'} color={'white'}>
                                    {(item.createdAt as Timestamp).toDate().toLocaleDateString()}
                                </Text>
                                <HStack position={'absolute'} right={0} bottom={0}>
                                    <FontAwesome name="heart-o" size={24} color={colors.primary[900]} />
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
        </Box>
    );
};
