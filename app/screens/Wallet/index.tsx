import { FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import { DropDownSelect } from 'components/DropdownSelect';
import { CashIcon } from 'components/Icons/Solid/Cash';
import { MoneyCheckIcon } from 'components/Icons/Solid/MoneyCheck';
import { PenIcon } from 'components/Icons/Solid/Pen';
import { TargetIcon } from 'components/Icons/Solid/Target';
import { WalletIcon } from 'components/Icons/Solid/Wallet';
import { MultiColsList } from 'components/MultiColsList';
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
    Input,
    KeyboardAvoidingView,
    CloseIcon,
    Fab,
    Menu,
    HamburgerIcon,
    Modal,
    AspectRatio,
} from 'native-base';
import { AppTabsNavigationKey, AuthNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logout } from 'slice/auth';
import { AppTabsStackScreenProps, RootStackScreenProps } from 'types';

type MenuItem = {
    title: string;
    icon: React.ReactNode;
    onPress?: () => void;
};

export const WalletScreen = (props: RootStackScreenProps<RootNavigatekey.Wallet>) => {
    // navigation
    const { navigation } = props;
    // const
    const menuItems: MenuItem[] = [
        {
            title: 'Create shortcut',
            icon: <Icon as={<FontAwesome />} name="external-link" size="lg"></Icon>,
        },
        {
            title: 'Transfer fund to another wallet',
            icon: <MoneyCheckIcon size="lg" />,
        },
        {
            title: 'Edit',
            icon: <PenIcon size="lg" />,
        },
        {
            title: 'Storage',
            icon: <Icon as={<FontAwesome />} name="download" size="lg"></Icon>,
        },
        {
            title: 'Delete',
            icon: <Icon as={<FontAwesome />} name="trash" size="lg"></Icon>,
        },
    ];
    // state
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => console.log('ahihi')}
                    borderRadius={100}
                    variant="ghost"
                    colorScheme="white"
                    endIcon={<Icon as={<FontAwesome />} name="search" size="md"></Icon>}
                />
            ),
        });
    }, [navigation]);

    const listItem = Array.from(Array(20).keys());

    return (
        <Box h="full" p={APP_PADDING}>
            <VStack space={2}>
                <Text bold color="gray.500">
                    Total
                </Text>
                <HStack
                    p={APP_PADDING}
                    space={2}
                    bg="white"
                    borderRadius="sm"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <HStack alignItems="center" space={4}>
                        <CashIcon />
                        <VStack>
                            <Text fontSize="md">Cash</Text>
                            <Text fontSize="md" color="gray.500">
                                0đ
                            </Text>
                        </VStack>
                    </HStack>
                    <Menu
                        w="240"
                        trigger={(triggerProps) => {
                            return (
                                <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                                    <Center p={2} pr={0}>
                                        <Icon as={<FontAwesome />} name="ellipsis-v"></Icon>
                                    </Center>
                                </Pressable>
                            );
                        }}
                        placement="bottom right"
                    >
                        {menuItems.map((m, idx) => (
                            <Menu.Item key={idx}>
                                <HStack alignItems="center" space={4}>
                                    {m.icon}
                                    <Text fontSize="md">{m.title}</Text>
                                </HStack>
                            </Menu.Item>
                        ))}
                    </Menu>
                </HStack>
            </VStack>
            <MultiColsList<number>
                data={listItem}
                numOfCols={6}
                renderItem={(item) => (
                    <Box h="full" w="full" bg="black">
                        {item}
                    </Box>
                )}
            />
            <Fab
                shadow={2}
                size="sm"
                h={16}
                w={16}
                icon={<Icon color="white" as={<FontAwesome />} name="plus" style={{ marginLeft: 4 }} />}
                onPress={() => setModalVisible(true)}
            />
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="full" animationPreset="slide">
                <Modal.Content borderRadius="0" style={{ marginBottom: 0, marginTop: 'auto' }}>
                    <Modal.Body p={APP_PADDING}>
                        <VStack space="md">
                            <Box position="relative">
                                <Text fontSize="lg" bold>
                                    Add wallet
                                </Text>
                                <Pressable
                                    position="absolute"
                                    right="0"
                                    top="0"
                                    height="full"
                                    pl="4"
                                    onPress={() => setModalVisible(false)}
                                >
                                    <VStack justifyContent="center" h="full">
                                        <CloseIcon />
                                    </VStack>
                                </Pressable>
                            </Box>
                            <Box>
                                <VStack space={2}>
                                    <HStack justifyContent="space-between" space={2}>
                                        <Box
                                            p={2}
                                            bg="primary.900"
                                            h={100}
                                            flex={1}
                                            borderRadius="md"
                                            position="relative"
                                            overflow="hidden"
                                        >
                                            <HStack justifyContent="space-between" alignItems="center">
                                                <Text bold fontSize="lg" color="white">
                                                    Standard wallet
                                                </Text>
                                                <Pressable>
                                                    <Icon
                                                        color="white"
                                                        as={<FontAwesome />}
                                                        name="question-circle"
                                                        size="md"
                                                    ></Icon>
                                                </Pressable>
                                            </HStack>
                                            <Box
                                                position="absolute"
                                                zIndex={1}
                                                right={0}
                                                bottom={-20}
                                                style={{ transform: [{ rotate: '-45deg' }] }}
                                                opacity={0.3}
                                            >
                                                <WalletIcon size={20} />
                                            </Box>
                                        </Box>
                                        <Box p={2} bg="teal.500" h={100} flex={1} borderRadius="md" overflow="hidden">
                                            <HStack justifyContent="space-between" alignItems="center">
                                                <Text bold fontSize="lg" color="white">
                                                    Linked wallet
                                                </Text>
                                                <Pressable>
                                                    <Icon
                                                        color="white"
                                                        as={<FontAwesome />}
                                                        name="question-circle"
                                                        size="md"
                                                    ></Icon>
                                                </Pressable>
                                            </HStack>
                                            <Box
                                                position="absolute"
                                                zIndex={1}
                                                right={0}
                                                bottom={-20}
                                                style={{ transform: [{ rotate: '-45deg' }] }}
                                                opacity={0.3}
                                            >
                                                <Icon as={<FontAwesome />} name="university" size={20}></Icon>
                                            </Box>
                                        </Box>
                                    </HStack>
                                    <HStack justifyContent="space-between" space={2}>
                                        <Box p={2} bg="pink.400" h={100} flex={1} borderRadius="md" overflow="hidden">
                                            <HStack justifyContent="space-between" alignItems="center">
                                                <Text bold fontSize="lg" color="white">
                                                    Credit wallet
                                                </Text>
                                                <Pressable>
                                                    <Icon
                                                        color="white"
                                                        as={<FontAwesome />}
                                                        name="question-circle"
                                                        size="md"
                                                    ></Icon>
                                                </Pressable>
                                            </HStack>
                                            <Box
                                                position="absolute"
                                                zIndex={1}
                                                right={0}
                                                bottom={-20}
                                                style={{ transform: [{ rotate: '-45deg' }] }}
                                                opacity={0.3}
                                            >
                                                <CashIcon size={20} />
                                            </Box>
                                        </Box>
                                        <Box p={2} bg="rose.500" h={100} flex={1} borderRadius="md" overflow="hidden">
                                            <HStack justifyContent="space-between" alignItems="center">
                                                <Text bold fontSize="lg" color="white">
                                                    Saved wallet
                                                </Text>
                                                <Pressable>
                                                    <Icon
                                                        color="white"
                                                        as={<FontAwesome />}
                                                        name="question-circle"
                                                        size="md"
                                                    ></Icon>
                                                </Pressable>
                                            </HStack>
                                            <Box position="absolute" zIndex={1} right={0} bottom={-20} opacity={0.3}>
                                                <TargetIcon size={20} />
                                            </Box>
                                        </Box>
                                    </HStack>
                                </VStack>
                            </Box>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};
