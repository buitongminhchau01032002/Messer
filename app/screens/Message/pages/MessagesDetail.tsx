import { FontAwesome } from '@expo/vector-icons';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import {
    BellIcon,
    EllipsisIcon,
    ImageIcon,
    MicIcon,
    NavigationIcon,
    PhoneIcon,
    VideoIcon,
} from 'components/Icons/Light';
import { TouchableOpacity } from 'components/TouchableOpacity';
import {
    Box,
    Button,
    Center,
    CloseIcon,
    Divider,
    Flex,
    HStack,
    Icon,
    IconButton,
    Input,
    KeyboardAvoidingView,
    Pressable,
    Text,
    VStack,
    useTheme,
} from 'native-base';
import { AppTabsNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView } from 'react-native';
import { AppTabsStackScreenProps, RootStackScreenProps } from 'types';
import { MessageItem } from '../components/MessageItem';
import { SendType } from '../type';

export const MessageDetailScreen = (props: RootStackScreenProps<RootNavigatekey.MessageDetail>) => {
    const { navigation, route } = props;
    // hooks
    const { colors } = useTheme();
    // states
    const [quoteMessage, setQuoteMessage] = useState('');
    const scrollRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HStack space={4}>
                    <TouchableOpacity>
                        <PhoneIcon color="primary.900" size="md" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <VideoIcon color="primary.900" size="md" />
                    </TouchableOpacity>
                </HStack>
            ),
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [navigation]);
    return (
        <Box flex={1} bg="white">
            <KeyboardAvoidingView flex={1}>
                <Box flex={1}>
                    <ScrollView
                        ref={scrollRef}
                        style={{ marginVertical: 8, marginHorizontal: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <VStack space={2}>
                            <MessageItem
                                content={
                                    'NativeBase started out as an open source framework that enabled developers to build high-quality mobile apps using React Native. The first version included UITabBar on iOS and Drawer on Android. NativeBase v1 was very well-received by the dev community.'
                                }
                                quote="abcd"
                                sendType={SendType.Receive}
                                onLongPress={() => {
                                    setQuoteMessage('abcd');
                                }}
                            />
                            <MessageItem
                                content={
                                    'NativeBase started out as an open source framework that enabled developers to build high-quality mobile apps using React Native. The first version included UITabBar on iOS and Drawer on Android. NativeBase v1 was very well-received by the dev community.'
                                }
                                sendType={SendType.Send}
                                onLongPress={() => {
                                    setQuoteMessage('abcd');
                                }}
                            />
                            <MessageItem
                                content={
                                    'NativeBase started out as an open source framework that enabled developers to build high-quality mobile apps using React Native. The first version included UITabBar on iOS and Drawer on Android. NativeBase v1 was very well-received by the dev community.'
                                }
                                quote="abcd"
                                sendType={SendType.Send}
                                onLongPress={() => {
                                    setQuoteMessage('abcd');
                                }}
                            />
                            <MessageItem
                                content={
                                    'NativeBase started out as an open source framework that enabled developers to build high-quality mobile apps using React Native. The first version included UITabBar on iOS and Drawer on Android. NativeBase v1 was very well-received by the dev community.'
                                }
                                quote="abcd"
                                sendType={SendType.Receive}
                                onLongPress={() => {
                                    setQuoteMessage('abcd');
                                }}
                            />
                        </VStack>
                    </ScrollView>
                </Box>
                <Box position="relative">
                    {quoteMessage ? (
                        <HStack
                            position="absolute"
                            bg="primary.400:alpha.90"
                            zIndex={1}
                            bottom="100%"
                            p={APP_PADDING}
                            space="sm"
                        >
                            <Divider orientation="vertical" thickness={2} bg="primary.900"></Divider>
                            <VStack flex={1} w="100%">
                                <Text bold color="white">
                                    Name
                                </Text>
                                <Text numberOfLines={3}>
                                    We provide a set of commonly used interface icons which you can directly use in your
                                    project. All our icons are create using createIcon function from NativeBase. We
                                    provide a set of commonly used interface icons which you can directly use in your
                                    project. All our icons are create using createIcon function from NativeBase.
                                </Text>
                            </VStack>
                            <VStack justifyContent="center" h="full">
                                <Pressable onPress={() => setQuoteMessage('')}>
                                    <CloseIcon />
                                </Pressable>
                            </VStack>
                        </HStack>
                    ) : undefined}
                    <HStack p={2} px={APP_PADDING} space={4} alignItems="flex-end">
                        <TouchableOpacity px={2} py={3}>
                            <MicIcon color="primary.900" size="md" />
                        </TouchableOpacity>
                        <TouchableOpacity px={2} py={3}>
                            <ImageIcon color="primary.900" size="md" />
                        </TouchableOpacity>
                        <Input
                            flex={1}
                            placeholder="Message"
                            fontSize="md"
                            bg="gray.100"
                            borderWidth={0}
                            borderRadius={20}
                            multiline
                            onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                        />
                        <TouchableOpacity px={2} py={3}>
                            <NavigationIcon color="primary.900" size="md" />
                        </TouchableOpacity>
                    </HStack>
                </Box>
            </KeyboardAvoidingView>
        </Box>
    );
};
