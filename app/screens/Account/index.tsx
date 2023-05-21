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
type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const AccountScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Account>) => {
    // navigation
    const { navigation } = props;
    // hooks
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HStack
                    space={2}
                >
                    <TouchableOpacity onPress={() => navigation.navigate(RootNavigatekey.InformationQR)}>
                        <Icon as={<FontAwesome />} name="hashtag" size={4} color={"blacks"} mr={2}></Icon>
                    </TouchableOpacity>
                    <Icon as={<FontAwesome />} name="list" size={4} color={"blacks"} mr={5}></Icon>
                </HStack>
            ),
        });
    }, [props.navigation]);

    const menuItem: MenuItem[] = [
        {
            title: 'Nofication',
            icon: <Icon as={<FontAwesome />} name="bell" size="xl" color={"primary.900"} />,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        },
        {
            title: 'Pricacy and Security',
            icon: <Icon as={<FontAwesome />} name="shield" size="xl" color={"primary.900"} />,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),

        },
        {
            title: 'Theme',
            icon: <Icon as={<FontAwesome />} name="file" size="xl" color={"primary.900"}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),

        },
        {
            title: 'Language',
            icon: <Icon as={<FontAwesome />} name="globe" size="xl" color={"primary.900"}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),

        }
    ];
    const menuItem2: MenuItem[] = [
        {
            title: 'Direct share',
            icon: <Icon as={<FontAwesome />} name="share" size="xl" color={"primary.900"}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),


        },
    ];




    return (
        <Box h="full" p={APP_PADDING} bg="white" >
            <ScrollView>
                <VStack space={2}>
                    <VStack space={2} mt={5} mb={10} >
                        <TouchableOpacity>
                            <HStack space={2}>
                                <Avatar size={120} bg="primary.900" ml={5} source={{
                                    uri: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
                                }}>

                                    Sa Đam
                                </Avatar>
                                <VStack space={1} ml={2} justifyContent={'center'}>
                                    <Text bold fontSize="md">
                                        Dennis
                                    </Text>
                                    <Text color="gray.400">hello@depper.com</Text>
                                    <Text color="gray.400">+123 456789</Text>
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
