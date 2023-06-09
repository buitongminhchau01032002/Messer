import { APP_PADDING } from 'app/constants/Layout';
import { TouchableOpacity } from 'components/TouchableOpacity';
import {
    AspectRatio,
    Avatar,
    Box,
    Divider,
    HStack,
    HamburgerIcon,
    IconButton,
    InfoIcon,
    Menu,
    Pressable,
    Text,
    VStack,
    Image,
    PlayIcon,
} from 'native-base';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Media, Message, SendType, User } from '../type';
import { EllipsisIcon } from 'components/Icons/Light';
import moment from 'moment';
import { FieldValue, Timestamp } from 'firebase/firestore';
import * as Clipboard from 'expo-clipboard';
import { Video, ResizeMode } from 'expo-av';
import Autolink from 'react-native-autolink';

type Props = {
    message: Message;
    sendType: SendType;
    onQuote?: () => void;
    onPin?: () => void;
    onDelete?: () => void;
    isPinned: boolean;
    isDeleted: boolean;
    onPressImage?: (idx: number, gallary: Media[]) => void;
};
export const MessageItem = (props: Props) => {
    const { message, sendType, onQuote, onPin, onPressImage, onDelete, isDeleted, isPinned } = props;
    const [isFocus, setIsFocus] = useState(false);
    const [timeoutUnfocus, setTimeoutUnfocus] = useState<NodeJS.Timeout>();

    if (sendType === SendType.Receive) {
        return (
            <HStack space="sm">
                <Avatar source={{ uri: (message.sender as User).avatar }} size="sm"></Avatar>
                <TouchableOpacity
                    maxWidth="70%"
                    onLongPress={isDeleted ? undefined : onQuote}
                    onPress={() => {
                        let timeoutHidden = setTimeout(() => {
                            setIsFocus(false);
                        }, 2000);
                        setTimeoutUnfocus((cur) => {
                            clearTimeout(cur);
                            return timeoutHidden;
                        });
                        setIsFocus(true);
                    }}
                    position="relative"
                    px={2}
                >
                    {message.isDeleted ? (
                        <Box p={2} mb={4} borderRadius="md" borderTopLeftRadius={0} bg="black" opacity={0.5}>
                            <Text color="white" fontSize="xs" italic>
                                Message is deleted
                            </Text>
                        </Box>
                    ) : message.type === 'text' ? (
                        <Box>
                            {isPinned && (
                                <IconButton
                                    icon={<InfoIcon size="sm" />}
                                    position="absolute"
                                    zIndex={1}
                                    top={-12}
                                    right={-12}
                                    borderWidth={1}
                                    padding={1}
                                    rounded="full"
                                    bg="white"
                                    borderColor="primary.900"
                                    _pressed={{ bg: 'white' }}
                                />
                            )}
                            <VStack
                                borderRadius="md"
                                borderTopLeftRadius={0}
                                p={APP_PADDING}
                                px={6}
                                bg="primary.900"
                                space="2"
                            >
                                {message.replyMessage ? (
                                    <HStack bg="primary.200" p={APP_PADDING} space="sm" borderRadius={2}>
                                        <Divider orientation="vertical" thickness={2} bg="primary.900"></Divider>
                                        <VStack>
                                            <Text bold color="white" fontSize="xs">
                                                {((message.replyMessage as Message).sender as User).name}
                                            </Text>
                                            {(message.replyMessage as Message).type === 'text' ? (
                                                <Text numberOfLines={4} fontSize="xs">
                                                    {(message.replyMessage as Message).content}
                                                </Text>
                                            ) : (
                                                <Text numberOfLines={4} fontSize="xs" bold>
                                                    Media
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                ) : undefined}
                                 <Autolink text={message.content || ''} 
                                linkStyle={{ color: 'white', textDecorationLine: 'underline' }}
                                renderText={(text) => <Text color='white'>{text}</Text>} 
                                />
                                {/* <Text color="white">{message.content}</Text> */}
                            </VStack>

                            <Text fontSize={'xs'} italic>
                                {isFocus ? moment((message.createdAt as Timestamp).seconds).format('HH:mm:ss') : ''}
                            </Text>
                        </Box>
                    ) : message.type !== 'story' ? (
                        <HStack flexWrap={'wrap'} maxWidth={216} borderRadius={12} p={2} bg="primary.900" overflow="hidden">
                            {(JSON.parse(message.content!) as Media[]).map((file, idx) => (
                                <Box w={100} h={100} position="relative">
                                    {file.type === 'image' ? (
                                        <Pressable
                                            w="100%"
                                            h="100%"
                                            onPress={() => onPressImage?.(idx, JSON.parse(message.content!) as Media[])}
                                        >
                                            <Image borderRadius={4} w="100%" h="100%" alt="..." src={file.url} />
                                        </Pressable>
                                    ) : (
                                        <Box w={100} h={100} bg="black" borderRadius={4} overflow="hidden">
                                            <Video
                                                style={{ width: 100, height: 100 }}
                                                source={{
                                                    uri: file.url,
                                                }}
                                                useNativeControls
                                                resizeMode={ResizeMode.CONTAIN}
                                            />
                                        </Box>
                                    )}
                                    {/* {file.thumb ? (
                                    <Box position="absolute" top={50} left={50} opacity={0.5}>
                                        <PlayIcon />
                                    </Box>
                                ) : undefined} */}
                                </Box>
                            ))}
                        </HStack>
                    ) : (
                        <VStack borderRadius="md" borderTopLeftRadius={0} p={APP_PADDING} bg="primary.900" space="2">
                            <HStack bg="primary.200" p={APP_PADDING} space="sm" borderRadius={2}>
                                <Divider orientation="vertical" thickness={2} bg="primary.900"></Divider>
                                <VStack>
                                    <Text bold color="white" fontSize="xs">
                                        Reply story
                                    </Text>
                                    <Image
                                        alignSelf={'flex-end'}
                                        height={150}
                                        width={100}
                                        source={{
                                            uri: message.fileIds?.[0],
                                        }}
                                        alt=""
                                    />
                                </VStack>
                            </HStack>

                            <Text color="white">{message.content}</Text>
                        </VStack>
                    )}
                </TouchableOpacity>
                <HStack flex={1} alignItems="flex-end">
                    {isFocus && !isDeleted ? (
                        <Menu
                            mb={2}
                            placement="top right"
                            onOpen={() => {
                                setTimeoutUnfocus((cur) => {
                                    clearTimeout(cur);
                                    return undefined;
                                });
                            }}
                            onClose={() => setIsFocus(false)}
                            trigger={(triggerProps) => {
                                return (
                                    <TouchableOpacity p={1} bg="gray.100" borderRadius={100} {...triggerProps}>
                                        <EllipsisIcon color="primary.900" size="md" />
                                    </TouchableOpacity>
                                );
                            }}
                        >
                            {/* <Menu.Item onPress={() => console.log('abdf')}>
                                <Text bold fontSize="md">
                                    Forward
                                </Text>
                            </Menu.Item> */}
                            <Menu.Item onPress={onQuote}>
                                <Text bold fontSize="md">
                                    Quote
                                </Text>
                            </Menu.Item>
                            {message.type === 'text' && (
                                <Menu.Item onPress={onPin}>
                                    <Text bold fontSize="md">
                                        {isPinned ? 'Unpin' : 'Pin'}
                                    </Text>
                                </Menu.Item>
                            )}
                            {message.type === 'text' && (
                                <Menu.Item onPress={() => Clipboard.setStringAsync(message.content ?? '')}>
                                    <Text bold fontSize="md">
                                        Copy
                                    </Text>
                                </Menu.Item>
                            )}
                            {/* <Menu.Item>
                                <Text bold fontSize="md" color="primary.900">
                                    Remove
                                </Text>
                            </Menu.Item> */}
                        </Menu>
                    ) : undefined}
                </HStack>
            </HStack>
        );
    } else if (sendType === SendType.Send) {
        return (
            <HStack space="sm">
                <HStack flex={1} alignItems="flex-end" justifyContent="flex-end">
                    {isFocus && !isDeleted ? (
                        <Menu
                            mb={2}
                            placement="top right"
                            onOpen={() => {
                                setTimeoutUnfocus((cur) => {
                                    clearTimeout(cur);
                                    return undefined;
                                });
                            }}
                            onClose={() => setIsFocus(false)}
                            trigger={(triggerProps) => {
                                return (
                                    <TouchableOpacity p={1} bg="gray.100" borderRadius={100} {...triggerProps}>
                                        <EllipsisIcon color="primary.900" size="md" />
                                    </TouchableOpacity>
                                );
                            }}
                        >
                            {/* <Menu.Item onPress={() => console.log('abdf')}>
                                <Text bold fontSize="md">
                                    Forward
                                </Text>
                            </Menu.Item> */}
                            <Menu.Item onPress={onQuote}>
                                <Text bold fontSize="md">
                                    Quote
                                </Text>
                            </Menu.Item>
                            {message.type === 'text' && (
                                <Menu.Item onPress={onPin}>
                                    <Text bold fontSize="md">
                                        {isPinned ? 'Unpin' : 'Pin'}
                                    </Text>
                                </Menu.Item>
                            )}
                            {message.type === 'text' && (
                                <Menu.Item onPress={() => Clipboard.setStringAsync(message.content ?? '')}>
                                    <Text bold fontSize="md">
                                        Copy
                                    </Text>
                                </Menu.Item>
                            )}
                            <Menu.Item onPress={onDelete}>
                                <Text bold fontSize="md" color="primary.900">
                                    Delete
                                </Text>
                            </Menu.Item>
                        </Menu>
                    ) : undefined}
                </HStack>
                <TouchableOpacity
                    maxWidth="70%"
                    alignItems="flex-end"
                    onLongPress={isDeleted ? undefined : onQuote}
                    onPress={() => {
                        let timeoutHidden = setTimeout(() => {
                            setIsFocus(false);
                        }, 2000);
                        setTimeoutUnfocus((cur) => {
                            clearTimeout(cur);
                            return timeoutHidden;
                        });
                        setIsFocus(true);
                    }}
                >
                    {/* {message.type ==='story' ? <></> : (true ? <></> : <></>)} */}
                    {message.isDeleted ? (
                        <Box p={2} borderRadius="md" borderTopRightRadius={0} bg="black" opacity={0.5}>
                            <Text color="white" fontSize="xs" italic>
                                Message is deleted
                            </Text>
                        </Box>
                    ) : message.type === 'text' ? (
                        <Box>
                            {isPinned && (
                                <IconButton
                                    icon={<InfoIcon size="sm" color="blue.900" />}
                                    position="absolute"
                                    zIndex={1}
                                    top={-12}
                                    left={-12}
                                    borderWidth={1}
                                    padding={1}
                                    rounded="full"
                                    bg="white"
                                    borderColor="blue.900"
                                    _pressed={{ bg: 'white' }}
                                />
                            )}
                            <VStack
                                borderRadius="md"
                                px={6}
                                borderTopRightRadius={0}
                                p={APP_PADDING}
                                bg="blue.900"
                                space="2"
                            >
                                {message.replyMessage ? (
                                    <HStack bg="blue.200" p={APP_PADDING} space="sm" borderRadius={2}>
                                        <Divider orientation="vertical" thickness={2} bg="blue.900"></Divider>
                                        <VStack>
                                            <Text bold color="white" fontSize="xs">
                                                {((message.replyMessage as Message).sender as User).name}
                                            </Text>
                                            {(message.replyMessage as Message).type === 'text' ? (
                                                <Text numberOfLines={4} fontSize="xs">
                                                    {(message.replyMessage as Message).content}
                                                </Text>
                                            ) : (
                                                <Text numberOfLines={4} fontSize="xs" bold>
                                                    Media
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                ) : undefined}
                                 <Autolink text={message.content || ''} 
                                linkStyle={{ color: 'white', textDecorationLine: 'underline' }}
                                renderText={(text) => <Text color='white'>{text}</Text>} 
                                />
                                {/* <Text color="white">{message.content}</Text> */}
                            </VStack>
                            <Text fontSize={'xs'} italic>
                                {isFocus ? moment((message.createdAt as Timestamp).seconds).format('HH:mm:ss') : ''}
                            </Text>
                        </Box>
                    ) : message.type !== 'story' ? (
                        <HStack flexWrap={'wrap'} maxWidth={216} borderRadius={12} p={2} bg="blue.900" overflow="hidden">
                            {(JSON.parse(message.content!) as Media[]).map((file, idx) => (
                                <Box w={100} h={100} position="relative">
                                    {file.type === 'image' ? (
                                        <Pressable
                                            w="100%"
                                            h="100%"
                                            onPress={() => onPressImage?.(idx, JSON.parse(message.content!) as Media[])}
                                        >
                                            <Image borderRadius={4} w="100%" h="100%" alt="..." src={file.url} />
                                        </Pressable>
                                    ) : (
                                        <Box w={100} h={100} bg="black" borderRadius={4} overflow="hidden">
                                            <Video
                                                style={{ width: 100, height: 100 }}
                                                source={{
                                                    uri: file.url,
                                                }}
                                                useNativeControls
                                                resizeMode={ResizeMode.CONTAIN}
                                            />
                                        </Box>
                                    )}
                                    {/* {file.thumb ? (
                                        <Box position="absolute" top={50} left={50} opacity={0.5}>
                                            <PlayIcon />
                                        </Box>
                                    ) : undefined} */}
                                </Box>
                            ))}
                        </HStack>
                    ) : (
                        <VStack borderRadius="md" borderTopRightRadius={0} p={APP_PADDING} bg="blue.900" space="2">
                            <HStack bg="blue.200" p={APP_PADDING} space="sm" borderRadius={2}>
                                <Divider orientation="vertical" thickness={2} bg="blue.900"></Divider>
                                <VStack>
                                    <Text bold color="white" fontSize="xs">
                                        Reply story
                                    </Text>
                                    <Image
                                        alignSelf={'flex-end'}
                                        height={150}
                                        width={100}
                                        source={{
                                            uri: message?.fileIds?.[0]!,
                                        }}
                                        alt=""
                                    />
                                </VStack>
                            </HStack>
                            <Text color="white">{message.content}</Text>
                        </VStack>
                    )}
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
