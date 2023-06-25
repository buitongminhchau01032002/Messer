import { createDrawerNavigator } from '@react-navigation/drawer';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import { DropDownSelect } from 'components/DropdownSelect';
import { BallotIcon } from 'components/Icons/Solid/Ballot';
import { RulerTriangleIcon } from 'components/Icons/Solid/RulerTriangle';
import { WalletIcon } from 'components/Icons/Solid/Wallet';
import { useAppDispatch } from 'hooks/index';
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
} from 'native-base';
import { AppTabsNavigationKey, AuthNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import { TouchableOpacity } from 'react-native';
import { AppTabsStackScreenProps } from 'types';
import { FontAwesome } from '@expo/vector-icons';
import { NavigateScreen } from 'components/Navigate';
import { auth, db } from 'config/firebase';
import { signOut } from 'firebase/auth';
import { collection, doc, documentId, getDoc, query, where } from 'firebase/firestore';
type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const AccountScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Account>) => {
    // navigation
    const { navigation } = props;
    // const currentUser  = auth.currentUser?.uid
    const [currentUser, setCurrentUser] = useState({
        avatar: '',
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = doc(db, 'User', auth.currentUser?.uid ?? '');
            const userSnap = await getDoc(userRef);
            setCurrentUser(userSnap.data());
            console.log(userSnap.data());
        };
        fetchUserData().catch(console.error);
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
