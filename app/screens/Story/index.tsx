import { current } from '@reduxjs/toolkit';
import { APP_PADDING } from 'app/constants/Layout';
import { EllipsisIcon, ImageIcon, MicIcon, NavigationIcon, PlusIcon } from 'components/Icons/Light';
import {
    Box,
    ScrollView,
    View,
    Image,
    Text,
    Input,
    SearchIcon,
    CloseIcon,
    HStack,
    VStack,
    Spacer,
    useTheme,
} from 'native-base';
import { TouchableOpacity } from 'components/TouchableOpacity';
import { AppTabsNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, Animated, FlatList } from 'react-native';
import { AppTabsStackScreenProps, RootStackScreenProps } from 'types';
import { FontAwesome } from '@expo/vector-icons';
import _ from 'lodash';
import { query } from '@firebase/firestore';
import {
    collection,
    collectionGroup,
    getDocs,
    where,
    serverTimestamp,
    Timestamp,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    addDoc,
    or,
    and,
} from 'firebase/firestore';
import { db } from 'config/firebase';
import { useAppSelector } from 'hooks/index';
import TimeAgo from 'javascript-time-ago';
import { Message } from 'screens/Message/type';

const screenWidth = Dimensions.get('window').width;

export const StoryScreen = (props: RootStackScreenProps<RootNavigatekey.Story>) => {
    const { colors } = useTheme();
    const flatlistRef = useRef<FlatList | null>(null);
    const [curStory, setCurStory] = useState(0);
    const [stories, setStories] = useState([]);
    const progress = useRef(new Animated.Value(0)).current;
    const timeAgo = new TimeAgo('en-US');
    const currentUser = useAppSelector((state) => state.auth.user);
    const [isScroll, setIsScroll] = useState(true);
    const [text, setText] = useState('');

    const fetchStory = async () => {
        const dayBefore = Timestamp.fromDate(new Date()).toDate();
        dayBefore.setDate(dayBefore.getDate() - 1);
        const storyTemp = [];
        const q = query(collectionGroup(db, 'Story'));
        const storySnap = await getDocs(q);
        storySnap.forEach((u) => {
            console.log(u.data().createdAt.toDate());
            if (u.data().createdAt.toDate() >= dayBefore) {
                storyTemp.push({
                    id: u.id,
                    liked: u.data().likedUser.includes(currentUser?.id),
                    ...u.data(),
                });
            }
        });
        console.log(storyTemp);
        setStories(storyTemp);
    };

    const progressAnim = progress.interpolate({
        inputRange: [0, screenWidth],
        outputRange: [0, 100],
    });

    const startScroll = (next: number) => {
        setIsScroll(true);
        progress.setValue(0);
        Animated.timing(progress, {
            toValue: screenWidth,
            duration: 5000,
            useNativeDriver: false,
        }).start((finish) => {
            if (finish.finished) {
                startScroll(next + 1);
                setCurStory(next);
                try {
                    flatlistRef.current?.scrollToIndex({ animated: true, index: next });
                } catch {
                    pauseScroll();
                }
            }
        });
    };
    const pauseScroll = () => {
        setIsScroll(false);
        Animated.timing(progress).stop();
    };

    const handleLike = (item) => {
        const storyRef = doc(db, 'User', item.owner.id, 'Story', item.id);

        // Atomically add a new region to the "regions" array field.
        if (item.liked) {
            updateDoc(storyRef, {
                likedUser: arrayRemove(currentUser?.id),
            });
        } else {
            updateDoc(storyRef, {
                likedUser: arrayUnion(currentUser?.id),
            });
        }

        const temp = stories.map((s) => {
            if (s.id == item.id) {
                return {
                    ...s,
                    liked: !s.liked,
                };
            } else {
                return s;
            }
        });
        setStories(temp);
    };

    const continueScroll = (next: number) => {
        setIsScroll(true);
        Animated.timing(progress, {
            toValue: screenWidth,
            duration: (5000 * (100 - progressAnim.__getValue())) / 100,
            useNativeDriver: false,
        }).start((finish) => {
            if (finish.finished) {
                startScroll(next + 1);
                setCurStory(next);
                flatlistRef.current?.scrollToIndex({ animated: true, index: next });
            }
        });
    };

    const handleChangeCur = (offset: number) => {
        setCurStory(offset / screenWidth);
    };

    useEffect(() => {
        fetchStory();
        startScroll(curStory + 1);
    }, []);

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => <></>,
        });
    }, [props.navigation]);

    async function handleMessage(item: any): Promise<void> {
        if(text.length == 0) return;
        const newMessage: Message = {
            content: text,
            sender: currentUser.id,
            type: 'story',
            fileIds: [item.imageUrl],
            createdAt: serverTimestamp(),
        };

        const q = query(
            collection(db, 'SingleRoom'),
            or(
                and(where('user1', '==', currentUser?.id), where('user2', '==', item.owner.id)),
                and(where('user2', '==', currentUser?.id), where('user1', '==', item.owner.id)),
            ),
        );

        const rooms = [];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            rooms.push({
                id: doc.id,
                ...doc.data(),
            });
            console.log('');
        });

        const room = rooms[0];
        console.log(room);
        if (room) {
            addDoc(collection(db, 'SingleRoom', room.id, 'Message'), newMessage).then(async (values) => {
                // const receiver = users.find((u) => u.id != newMessage.sender);
                // const sender = users.find((u) => u.id == newMessage.sender);

                await updateDoc(doc(db, 'SingleRoom', room.id ?? ''), {
                    lastMessage: newMessage,
                    lastMessageTimestamp: newMessage.createdAt,
                    reads: [currentUser.id],
                });

                // fetch('https://fcm.googleapis.com/fcm/send', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         Authorization:
                //             'key=AAAAu3T5eSI:APA91bFfynL6hecTGjN4jGBUULhccdSWIBKjG0oBWefs3D5KvDu5IWHUJSJD9F3uMjhmuZbXqsUSj6GBsqRYkQgt2d2If4FUaYHy3bZ-E8NpBhqHYjsyfB9D1Nk-hxVKelYn165SqRdL',
                //     },
                //     body: JSON.stringify({
                //         to: receiver.deviceToken,
                //         notification: {
                //             body: newMessage.content,
                //             OrganizationId: '2',
                //             content_available: true,
                //             priority: 'high',
                //             subtitle: 'PhotoMe',
                //             title: sender.name.concat(' texted you'),
                //         },
                //     }),
                // });
            });
        }

        setText("")
    }

    return (
        <View backgroundColor={colors.primary[900]} flex={1}>
            <FlatList
                ref={flatlistRef}
                data={stories}
                horizontal
                pagingEnabled
                onMomentumScrollEnd={(e) => {
                    console.log('hi');
                    handleChangeCur(e.nativeEvent.contentOffset.x);
                    startScroll(curStory + 1);
                }}
                renderItem={({ item, index }) => (
                    <Box w={screenWidth}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                if (isScroll) {
                                    pauseScroll();
                                } else {
                                    continueScroll(curStory + 1);
                                }
                            }}
                            position="absolute"
                            top="20"
                            left="0"
                            right="0"
                            bottom="20"
                            h="full"
                            w="full"
                        >
                            <Image
                                flex={1}
                                source={{
                                    uri: item.imageUrl,
                                }}
                                alt=""
                            />
                        </TouchableOpacity>

                        <Box px={4} pt="10" flexDirection={'row'}>
                            <HStack space={2} alignItems={'center'} flex={1}>
                                {/* <Image
                                    alt="..."
                                    source={{
                                        uri: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
                                    }}
                                    style={{ width: 40, height: 40 }}
                                    borderRadius={100}
                                ></Image> */}
                                <Text bold color={'white'} fontSize={18}>
                                    {item.owner.name}
                                </Text>

                                <Text fontSize={14} color={'white'} pt={1}>
                                    {timeAgo.format(item.createdAt.toDate())}
                                </Text>
                                <Spacer flex={1}></Spacer>
                                <TouchableOpacity onPress={() => {}}>
                                    <CloseIcon size="md" color="white" />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <HStack position="absolute" bottom={4} px={APP_PADDING} space={4} alignItems="flex-end">
                            <Input
                                value={text}
                                flex={1}
                                placeholder="Message"
                                fontSize="sm"
                                px={4}
                                borderWidth={0}
                                borderRadius={20}
                                multiline
                                color={'white'}
                                backgroundColor="gray.900:alpha.50"
                                onChangeText={(e) => setText(e)}
                            />
                            <TouchableOpacity px={2} py={3} onPress={() => handleMessage(item)}>
                                <NavigationIcon color="primary.900" size="md" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                px={2}
                                py={3}
                                onPress={() => {
                                    // pauseScroll();
                                    handleLike(item);
                                }}
                            >
                                {item.liked ? (
                                    <FontAwesome name="heart" size={24} color={colors.primary[900]} />
                                ) : (
                                    <FontAwesome name="heart-o" size={24} color={colors.primary[900]} />
                                )}
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                )}
            />
            <Animated.View
                style={{
                    backgroundColor: 'white',
                    width: progress,
                    position: 'absolute',
                    marginTop: 28,
                    height: 4,
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                }}
            />
        </View>
    );
};
