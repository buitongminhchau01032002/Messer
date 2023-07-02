import { FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import { DropDownSelect } from 'components/DropdownSelect';
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
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logout } from 'slice/auth';
import { AppTabsStackScreenProps } from 'types';
import * as Contacts from 'expo-contacts';
import { MessageCircleIcon, PhoneIcon, VideoIcon } from 'components/Icons/Light';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'config/firebase';

export const ContactScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Contact>) => {
    // hooks
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const navigate = useNavigation();

    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const usersSnap = await getDocs(collection(db, 'User'));
            const _users : any[] = [];
            usersSnap.forEach((userSnap) => {
                _users.push({ id: userSnap.id, ...userSnap.data() });
            });
            setUsers(_users);
        })();
    }, []);

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
    }, []);

    function handleCall(user: any, type: string) {
        props.navigation.navigate(RootNavigatekey.CallWaiting, {toUser: user, type});
    }

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
                <Text>Welcome to Home</Text>
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
                <Button onPress={() => navigate.navigate(RootNavigatekey.ComingCall)}>To coming call</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.Calling)}>To calling</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.CallWaiting)}>To call waiting</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.Story)}>To Story</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.NewStory)}>To New Story</Button>

                <ScrollView>
                    {users?.map((user) => (
                        <HStack key={user.id} py="2" borderBottomColor="black" borderBottomWidth={1} justifyContent="space-between" alignItems="center">
                            <Text>{user.email}</Text>
                            <HStack>

                            <IconButton onPress={() => handleCall(user, 'no-video')} icon={<PhoneIcon size="md"/>}/>
                            <IconButton onPress={() => handleCall(user, 'video')} icon={<VideoIcon size="xl"/>}/>
                            </HStack>
                        </HStack>
                    ))}
                </ScrollView>
            </Box>
        </Box>
    );
};
