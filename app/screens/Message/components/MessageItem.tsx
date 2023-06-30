import { APP_PADDING } from 'app/constants/Layout';
import { TouchableOpacity } from 'components/TouchableOpacity';
import { Avatar, Box, Divider, HStack, HamburgerIcon, Menu, Pressable, Text, VStack, Image } from 'native-base';
import React, { useLayoutEffect, useRef } from 'react';
import { View } from 'react-native';
import { Message, SendType, User } from '../type';
import { EllipsisIcon } from 'components/Icons/Light';

type Props = {
    message: Message;
    sendType: SendType;
    isFocus?: boolean;
    onLongPress?: () => void;
};
export const MessageItem = (props: Props) => {
    const { message, sendType, isFocus = true, onLongPress } = props;
    if (sendType === SendType.Receive) {
        return (
            <HStack space="sm">
                <Avatar source={{ uri: (message.sender as User).avatar }} size="sm"></Avatar>
                <TouchableOpacity maxWidth="70%" onLongPress={onLongPress}>
                    <VStack borderRadius="md" p={APP_PADDING} bg="primary.900" space="2">
                        {message.replyMessage ? (
                            <HStack bg="primary.200" p={APP_PADDING} space="sm" borderRadius={2}>
                                <Divider orientation="vertical" thickness={2} bg="primary.900"></Divider>
                                <VStack>
                                    <Text bold color="white" fontSize="xs">
                                        {((message.replyMessage as Message).sender as User).name}
                                    </Text>
                                    <Text numberOfLines={4} fontSize="xs">
                                        {(message.replyMessage as Message).content}
                                    </Text>
                                </VStack>
                            </HStack>
                        ) : undefined}
                        {message.type == 'story' ? (
                            <HStack bg="primary.200" p={APP_PADDING} space="sm" borderRadius={2}>
                                {message.fileIds[0] ? (
                                    <Image
                                        // flex={1}
                                        height={30}
                                        width={30}
                                        source={{
                                            uri: message.fileIds[0],
                                        }}
                                        alt=""
                                    />
                                ) : (
                                    <></>
                                )}
                            </HStack>
                        ) : undefined}
                        <Text color="white">{message.content}</Text>
                    </VStack>
                </TouchableOpacity>
                <HStack flex={1} alignItems="flex-end">
                    {isFocus ? (
                        <Menu
                            mb={2}
                            placement="top right"
                            trigger={(triggerProps) => {
                                return (
                                    <TouchableOpacity p={1} bg="gray.100" borderRadius={100} {...triggerProps}>
                                        <EllipsisIcon color="primary.900" size="md" />
                                    </TouchableOpacity>
                                );
                            }}
                        >
                            <Menu.Item onPress={() => console.log('abdf')}>
                                <Text bold fontSize="md">
                                    Forward
                                </Text>
                            </Menu.Item>
                            <Menu.Item onPress={() => console.log('abdf')}>
                                <Text bold fontSize="md">
                                    Quote
                                </Text>
                            </Menu.Item>
                            <Menu.Item>
                                <Text bold fontSize="md">
                                    Copy
                                </Text>
                            </Menu.Item>
                            <Menu.Item>
                                <Text bold fontSize="md" color="primary.900">
                                    Remove
                                </Text>
                            </Menu.Item>
                        </Menu>
                    ) : undefined}
                </HStack>
            </HStack>
        );
    } else if (sendType === SendType.Send) {
        return (
            <HStack space="sm">
                <HStack flex={1} alignItems="flex-end" justifyContent="flex-end">
                    {isFocus ? (
                        <Menu
                            mb={2}
                            placement="top right"
                            trigger={(triggerProps) => {
                                return (
                                    <TouchableOpacity p={1} bg="gray.100" borderRadius={100} {...triggerProps}>
                                        <EllipsisIcon color="primary.900" size="md" />
                                    </TouchableOpacity>
                                );
                            }}
                        >
                            <Menu.Item onPress={() => console.log('abdf')}>
                                <Text bold fontSize="md">
                                    Forward
                                </Text>
                            </Menu.Item>
                            <Menu.Item>
                                <Text bold fontSize="md">
                                    Copy
                                </Text>
                            </Menu.Item>
                            <Menu.Item>
                                <Text bold fontSize="md" color="primary.900">
                                    Remove
                                </Text>
                            </Menu.Item>
                        </Menu>
                    ) : undefined}
                </HStack>
                <TouchableOpacity maxWidth="70%" onLongPress={onLongPress}>
                    <VStack borderRadius="md" p={APP_PADDING} bg="blue.900" space="2">
                        {message.replyMessage ? (
                            <HStack bg="blue.200" p={APP_PADDING} space="sm" borderRadius={2}>
                                <Divider orientation="vertical" thickness={2} bg="blue.900"></Divider>
                                <VStack>
                                    <Text bold color="white" fontSize="xs">
                                        {((message.replyMessage as Message).sender as User).name}
                                    </Text>
                                    <Text numberOfLines={2} fontSize="xs">
                                        {(message.replyMessage as Message).content}
                                    </Text>
                                </VStack>
                            </HStack>
                        ) : undefined}
                        {message.type == 'story' ? (
                            <HStack space="sm" borderRadius={2}>
                                <VStack>
                                    <Text color = 'white'>Reply your story</Text>
                                    {message.fileIds[0] ? (
                                        <Image
                                        alignSelf={'flex-end'}
                                            height={150}
                                            width={100}
                                            source={{
                                                uri: message.fileIds[0],
                                            }}
                                            alt=""
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </VStack>
                            </HStack>
                        ) : undefined}
                        <Text color="white">{message.content}</Text>
                    </VStack>
                </TouchableOpacity>
            </HStack>
        );
    } else {
        return (
            <HStack space="sm" flex={1} alignSelf={'center'}>
                <Text color="gray.500">{message.content}</Text>
            </HStack>
        );
    }
};
