import { FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import { DropDownSelect } from 'components/DropdownSelect';
import { BallotIcon } from 'components/Icons/Solid/Ballot';
import { RulerTriangleIcon } from 'components/Icons/Solid/RulerTriangle';
import { WalletIcon } from 'components/Icons/Solid/Wallet';
import { useAppDispatch } from 'hooks/index';
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
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { AppTabsStackScreenProps } from 'types';

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
    const menuItem: MenuItem[] = [
        {
            title: 'My wallets',
            icon: <WalletIcon size="xl" />,
            extra: (
                <Button my={2} borderRadius={100} variant="subtle" _text={{ color: 'primary.900', fontWeight: 'bold' }}>
                    Liên kết ngân hàng
                </Button>
            ),
            onPress: () => navigation.navigate(RootNavigatekey.Wallet),
        },
        {
            title: 'Invoices',
            icon: <BallotIcon size="xl" />,
        },
        {
            title: 'Events',
            icon: <Icon as={<FontAwesome />} name="calendar" size="xl"></Icon>,
        },
        {
            title: 'Transactions',
            icon: <Icon as={<FontAwesome />} name="undo" size="xl"></Icon>,
        },
        {
            title: 'Tools',
            icon: <RulerTriangleIcon size="xl" />,
        },
    ];
    return (
        <Box h="full" p={APP_PADDING} bg="white">
            <ScrollView>
                <VStack space={2}>
                    <TouchableOpacity>
                        <Center position="relative">
                            <VStack alignItems="center" space={1}>
                                <Avatar size="lg" bg="primary.900">
                                    P
                                </Avatar>
                                <Text bold fontSize="md">
                                    Pham1506thang
                                </Text>
                                <Text color="gray.400">pham1506thang@gmail.com</Text>
                            </VStack>
                            <Center position="absolute" h="100%" right={0}>
                                <Icon as={<FontAwesome />} name="chevron-right"></Icon>
                            </Center>
                        </Center>
                    </TouchableOpacity>
                    <VStack space={2}>
                        {menuItem.map((m, idx) => (
                            <VStack key={idx}>
                                <TouchableOpacity onPress={m.onPress}>
                                    <HStack py={2} alignItems="center">
                                        <HStack space="lg" alignItems="center">
                                            {m.icon}
                                            <Text fontSize="md">{m.title}</Text>
                                        </HStack>
                                        <Center position="absolute" h="100%" right={0}>
                                            <Icon as={<FontAwesome />} name="chevron-right"></Icon>
                                        </Center>
                                    </HStack>
                                </TouchableOpacity>
                                {m.extra}
                            </VStack>
                        ))}
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>
    );
};
