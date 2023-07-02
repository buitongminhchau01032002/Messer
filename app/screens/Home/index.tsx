import { FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import { DropDownSelect } from 'components/DropdownSelect';
import { useAppDispatch, useAppSelector } from 'hooks/index';
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
    FlatList,
    useTheme,
} from 'native-base';
import { AppTabsNavigationKey, AuthNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logout } from 'slice/auth';
import { AppTabsStackScreenProps } from 'types';
import * as Contacts from 'expo-contacts';
<<<<<<< Updated upstream
import { MessageCircleIcon, PhoneIcon } from 'components/Icons/Light';
=======
import { MessageCircleIcon, PhoneIcon, PlusIcon, VideoIcon } from 'components/Icons/Light';
import { Timestamp, collection, collectionGroup, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from 'config/firebase';
import { RefreshControl, TouchableOpacity } from 'react-native-gesture-handler';
>>>>>>> Stashed changes

export const ContactScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Contact>) => {
    // hooks
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.user);
    const navigate = useNavigation();
    const [stories, setStories] = useState([]);
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = React.useState(false);

    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
<<<<<<< Updated upstream
=======
    const [users, setUsers] = useState<any[]>([]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await init();
        setRefreshing(false);
    }, []);
>>>>>>> Stashed changes

    const init = async () => {
        const dayBefore = Timestamp.fromDate(new Date()).toDate();
        dayBefore.setDate(dayBefore.getDate() - 1);
        const storyTemp = [];
        storyTemp.push(3);

        const q = query(collectionGroup(db, 'Story'), orderBy('createdAt', 'desc'));
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
        setStories(storyTemp);
    };

    useEffect(() => {
        props.navigation.setOptions({
            title: 'Story',
            headerLeft: () => <></>,
        });
    }, [props.navigation]);

    useEffect(() => {}, []);

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync();

                if (data.length > 0) {
                    setContacts(data);
                    console.log(data[0]);
                }
            }
        })();
        init().catch((e) => {
            console.error(e);
        });
    }, []);
<<<<<<< Updated upstream
=======

    function handleCall(user: any) {
        props.navigation.navigate(RootNavigatekey.CallWaiting, { toUser: user });
    }

>>>>>>> Stashed changes
    return (
        // <Box h="full">
        //     <Box p={APP_PADDING} w="full" flex={1}>
        //         <Text>Welcome to Home</Text>
        //         <Box
        //             h={20}
        //             bg="primary.100"
        //             style={
        //                 {
        //                     // shadowRadius: 2,
        //                     // shadowOffset: {
        //                     //     width: 0,
        //                     //     height: -10,
        //                     // },
        //                     // shadowColor: '#000000',
        //                     // elevation: 6,
        //                 }
        //             }
        //             shadow={9}
        //         ></Box>
        //         <Button onPress={() => navigate.navigate(RootNavigatekey.ComingCall)}>To coming call</Button>
        //         <Button onPress={() => navigate.navigate(RootNavigatekey.Calling)}>To calling</Button>
        //         <Button onPress={() => navigate.navigate(RootNavigatekey.CallWaiting)}>To call waiting</Button>
        //         <Button onPress={() => navigate.navigate(RootNavigatekey.Story)}>To Story</Button>
        //     </Box>
        // </Box>
        // <ScrollView flex={1} p={APP_PADDING} bg="white">
        //     <VStack space={2} flex={1} bg="white">
        //         {contacts.map((contact, idx) => (
        //             <HStack
        //                 justifyContent="space-between"
        //                 key={idx}
        //                 w="100%"
        //                 bg="primary.100:alpha.40"
        //                 p={APP_PADDING}
        //                 borderRadius={APP_PADDING}
        //             >
        //                 <VStack space={1}>
        //                     <Text fontSize={'lg'} color={'primary.900'} bold>
        //                         {contact.name}
        //                     </Text>
        //                     <Text bold>{contact.phoneNumbers?.[0]?.number}</Text>
        //                 </VStack>
        //                 <HStack space={2}>
        //                     <IconButton icon={<MessageCircleIcon />}></IconButton>
        //                     <IconButton icon={<PhoneIcon style={{ transform: [{ scaleX: -1 }] }} />}></IconButton>
        //                 </HStack>
        //             </HStack>
        //         ))}
        //     </VStack>
        // </ScrollView>
        <Box h="full">
            
            <Box p={APP_PADDING} w="full" flex={1}>
<<<<<<< Updated upstream
                <Text>Welcome to Home</Text>
                <Box h={20} bg='primary.100' style={{
                    // shadowRadius: 2,
                    // shadowOffset: {
                    //     width: 0,
                    //     height: -10,
                    // },
                    // shadowColor: '#000000',
                    // elevation: 6,
                }} shadow={9}></Box>
=======
                {/* <Text>Welcome to Home</Text>
                <Box
                    h={20}
                    bg="primary.100"
                    style={
                        {
                            // shadowRadius: 2,
                            // shadowOffset: {
                            //     width: 0,
                            //     height: -10,
                            // },
                            // shadowColor: '#000000',
                            // elevation: 6,
                        }
                    }
                    shadow={9}
                ></Box>
>>>>>>> Stashed changes
                <Button onPress={() => navigate.navigate(RootNavigatekey.ComingCall)}>To coming call</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.Calling)}>To calling</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.CallWaiting)}>To call waiting</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.Story)}>To Story</Button>
<<<<<<< Updated upstream
                <Button onPress={() => navigate.navigate(RootNavigatekey.NewStory)}>To New Story</Button>
=======
                <Button onPress={() => navigate.navigate(RootNavigatekey.NewStory)}>To New Story</Button> */}
                <FlatList
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    numColumns={2}
                    data={stories}
                    renderItem={({ item, index }) => {
                        return index != 0 ? (
                            <Pressable
                                height="220px"
                                flex={1}
                                onPress={() => {
                                    // console.log(stories)
                                    const temp = stories.filter((e) => {
                                        return e != 3;
                                    });
                                    navigate.navigate(RootNavigatekey.Story, { id: item.id, stories: temp });
                                }}
                            >
                                <Box
                                    height="220px"
                                    flex={1}
                                    margin={2}
                                    position={'relative'}
                                    borderRadius={10}
                                    overflow={'hidden'}
                                >
                                    <Image
                                        alt="..."
                                        flex={1}
                                        source={{
                                            uri: item.imageUrl,
                                        }}
                                        borderRadius={10}
                                    />
                                    <Image
                                        alt="..."
                                        top={2}
                                        left={2}
                                        position={'absolute'}
                                        height={10}
                                        width={10}
                                        source={{
                                            uri: item.owner.avatar,
                                        }}
                                        borderRadius={50}
                                    />
                                    <Text bottom={2} left={2} position={'absolute'} color={'white'}>
                                        {item.owner.name}
                                    </Text>
                                </Box>
                            </Pressable>
                        ) : (
                            <Pressable
                                height="220px"
                                flex={1}
                                margin={2}
                                onPress={() => {
                                    navigate.navigate(RootNavigatekey.NewStory);
                                }}
                            >
                                <Box
                                    height="220px"
                                    flex={1}
                                    position={'relative'}
                                    borderRadius={10}
                                    overflow={'hidden'}
                                >
                                    <Image
                                        alt="..."
                                        flex={1}
                                        source={{
                                            uri: currentUser?.avatar,
                                        }}
                                        borderRadius={10}
                                    />
                                    <Box
                                        top={2}
                                        left={2}
                                        position={'absolute'}
                                        height={10}
                                        width={10}
                                        borderRadius={50}
                                        background={'white'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                    >
                                        <PlusIcon size={6}></PlusIcon>
                                    </Box>
                                    <Text bottom={2} left={2} position={'absolute'} color={'white'}>
                                        Add to your story
                                    </Text>
                                </Box>
                            </Pressable>
                        );
                    }}
                />

                {/* <ScrollView>
                    {users?.map((user) => (
                        <HStack key={user.id} py="2" borderBottomColor="black" borderBottomWidth={1} justifyContent="space-between" alignItems="center">
                            <Text>{user.email}</Text>
                            <IconButton onPress={() => handleCall(user)} icon={<VideoIcon size="xl"/>}/>
                        </HStack>
                    ))}
                </ScrollView> */}
>>>>>>> Stashed changes
            </Box>
        </Box >
    );
};
