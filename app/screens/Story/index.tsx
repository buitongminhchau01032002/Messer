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
import { collection, collectionGroup, getDocs, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from 'config/firebase';

const screenWidth = Dimensions.get('window').width;

export const StoryScreen = (props: RootStackScreenProps<RootNavigatekey.Story>) => {
    const { colors } = useTheme();
    const flatlistRef = useRef<FlatList | null>(null);
    const [curStory, setCurStory] = useState(0);

    const [stories, setStories] = useState([]);
    const progress = useRef(new Animated.Value(0)).current;

    const fetchUserData = async () => {
        const a = Timestamp.fromDate(new Date()).toDate();
        a.setDate(a.getDate() - 1);
        console.log(a)
        const searchUser = [];
        const q = query(collectionGroup(db, 'Story')
        // , where('createdAt', '>=', a)
        );
        const searchUserSnapshot = await getDocs(q);
        searchUserSnapshot.forEach((u) => {
            console.log(u.data().createdAt.toDate() )
            if(u.data().createdAt.toDate() >= a){
                searchUser.push({
                    id: u.id,
                    ...u.data(),
                });
            }
            
        });
        console.log(searchUser);
        setStories(searchUser);
    };

    const progressAnim = progress.interpolate({
        inputRange: [0, screenWidth],
        outputRange: [0, 100],
    });

    const startScroll = (next: number) => {
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
        Animated.timing(progress).stop();
    };

    const continueScroll = (next: number) => {
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
        fetchUserData();
        startScroll(curStory + 1);
    }, []);

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => <></>,
        });
    }, [props.navigation]);

    return (
        <View backgroundColor={'white'} flex={1}>
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
                        <Image
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            bottom="0"
                            h="full"
                            w="full"
                            source={{
                                uri: item.imageUrl,
                            }}
                            alt=""
                        />
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
                                    An Bùi nè {index}
                                </Text>

                                <Text fontSize={14} color={'white'} pt={1}>
                                    2 minutes ago
                                </Text>
                                <Spacer flex={1}></Spacer>
                                <TouchableOpacity onPress={() => {}}>
                                    <CloseIcon size="md" color="white" />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <HStack position="absolute" bottom={4} px={APP_PADDING} space={4} alignItems="flex-end">
                            <Input
                                flex={1}
                                placeholder="Message"
                                fontSize="sm"
                                px={4}
                                borderWidth={0}
                                borderRadius={20}
                                multiline
                                color={'white'}
                                backgroundColor="gray.900:alpha.50"
                            />
                            <TouchableOpacity px={2} py={3} onPress={() => continueScroll(curStory + 1)}>
                                <NavigationIcon color="primary.900" size="md" />
                            </TouchableOpacity>

                            <TouchableOpacity px={2} py={3} onPress={pauseScroll}>
                                <FontAwesome name="heart-o" size={24} color={colors.primary[900]} />
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
