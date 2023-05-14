import { AppBar } from 'components/AppBar';
import {
    Button,
    Center,
    Flex,
    Stack,
    View,
    Text,
    HStack,
    Icon,
    Spacer,
    Image,
    ScrollView,
    VStack,
    Box,
    Pressable,
    IconButton,
    useTheme,
} from 'native-base';
import { AppTabsNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppTabsStackScreenProps } from 'types';
import { MessageItem } from './components/MessageItem';
import { EvilIcons, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, TouchableHighlight, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';

const userList = [
    {
        name: 'Thang abc dgac ',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
];

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { APP_PADDING } from 'app/constants/Layout';
import {
    BellIcon,
    BellOffIcon,
    EllipsisIcon,
    LinkIcon,
    LogoutIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
    VolumeMuteIcon,
} from 'components/Icons/Light';

const rightSwipeActions = () => {
    return (
        <HStack px={4} space={4} alignItems="center" bg="black" justifyContent="center">
            <IconButton borderRadius={100} bg="gray.700" icon={<LogoutIcon color="white" size="sm" />} />
            <IconButton borderRadius={100} bg="gray.700" icon={<BellOffIcon color="white" size="sm" />} />
            <IconButton borderRadius={100} bg="gray.700" icon={<LinkIcon color="white" size="sm" />} />
            <IconButton borderRadius={100} bg="gray.700" icon={<TrashIcon color="primary.900" size="sm" />} />
        </HStack>
    );
};

const ListItem = (item: { name: string; avt: string; onPress?: () => void }) => (
    <GestureHandlerRootView>
        <Swipeable renderRightActions={rightSwipeActions} renderLeftActions={() => <View />}>
            <Pressable onPress={item.onPress}>
                <HStack space={4} pl={4} bg="white">
                    <Image
                        alt="..."
                        source={{ uri: item.avt }}
                        style={{ width: 64, height: 64 }}
                        borderRadius={100}
                    ></Image>
                    <VStack flex={1} space={2} justifyContent="center">
                        <Text bold fontSize="md">
                            {item.name}
                        </Text>
                        <Text isTruncated color="gray.500">
                            {item.avt}
                        </Text>
                    </VStack>
                    <VStack justifyContent="center" space={2} mx={4} alignItems="center">
                        <EllipsisIcon color="primary.900" size="sm" />
                        <Text color="blue.900">3m</Text>
                    </VStack>
                </HStack>
            </Pressable>
        </Swipeable>
    </GestureHandlerRootView>
);
export const MessageScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Message>) => {
    const { navigation } = props;
    const { colors } = useTheme();
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Channels',
            // backBu
            headerLeft: () => (
                <HStack mx={4}>
                    <BellIcon size="md" color="primary.900" />
                </HStack>
            ),

            headerRight: () => (
                <HStack space={4} alignItems={'center'} mr={4}>
                    <TouchableOpacity onPress={() => navigation.navigate(RootNavigatekey.Search)}>
                        <SearchIcon size="md" color="primary.900" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                        <PlusIcon size="md" color="primary.900" />
                    </TouchableOpacity>
                </HStack>
            ),
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [props.navigation]);

    return (
        <View backgroundColor={'white'} flex={1}>
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <VStack space={2}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space={4}>
                            {userList.map((item, idx) => (
                                <VStack width={16} space={1} alignItems="center" ml={idx === 0 ? 4 : 0}>
                                    <Center width={16} height={16} position="relative">
                                        <Image
                                            borderRadius={100}
                                            alt="..."
                                            width="full"
                                            height="full"
                                            source={{ uri: item.avt }}
                                        ></Image>
                                        <Box
                                            borderWidth={2}
                                            borderColor="white"
                                            borderRadius={100}
                                            position="absolute"
                                            width={4}
                                            height={4}
                                            bg="green.900"
                                            bottom={0}
                                            right={0}
                                        ></Box>
                                    </Center>
                                    <Text textAlign="center" fontSize="xs" isTruncated noOfLines={1}>
                                        {item.name}
                                    </Text>
                                </VStack>
                            ))}
                        </HStack>
                    </ScrollView>
                    <VStack space={2}>
                        {userList.map((item, idx) => (
                            <ListItem
                                {...item}
                                key={idx}
                                onPress={() => navigation.navigate(RootNavigatekey.MessageDetail)}
                            />
                        ))}
                    </VStack>
                </VStack>
            </ScrollView>
        </View>
    );
};
