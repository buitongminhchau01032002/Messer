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

const rightSwipeActions = () => {
    return (
        <VStack space={4} bg="black">
            <Box width={32}></Box>
            <Box width={32}></Box>
            <Box width={32}></Box>
        </VStack>
    );
};

const ListItem = (item: { name: string; avt: string }) => (
    <GestureHandlerRootView>
        <Swipeable renderRightActions={rightSwipeActions} renderLeftActions={() => <View />}>
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
                <VStack justifyContent="center" space={2} mx={4}>
                    <Text>hi</Text>
                    <Text color="blue.900">3m</Text>
                </VStack>
            </HStack>
        </Swipeable>
    </GestureHandlerRootView>
);
export const MessageScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Message>) => {
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Channels',
            headerLeft: () => (
                <HStack marginLeft={6}>
                    <Ionicons name="notifications" size={24} color="black" />
                </HStack>
            ),

            headerRight: () => (
                <HStack marginRight={6} space={6}>
                    <EvilIcons name="search" size={36} color="black" />
                    <Ionicons name="add-outline" size={36} color="black" />
                </HStack>
            ),
        });
    }, [props.navigation]);

    return (
        <View backgroundColor={'white'} flex={1} pt={APP_PADDING}>
            <ScrollView flex={1}>
                <VStack space={2}>
                    <ScrollView horizontal>
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
                            <ListItem {...item} key={idx} />
                        ))}
                    </VStack>
                </VStack>
            </ScrollView>
        </View>
    );
};
