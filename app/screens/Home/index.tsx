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
import { MessageCircleIcon, PhoneIcon } from 'components/Icons/Light';

export const ContactScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Contact>) => {
    // hooks
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const navigate = useNavigation();

    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

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
        <ScrollView flex={1} p={APP_PADDING} bg="white">
            <VStack space={2} flex={1} bg="white">
                {contacts.map((contact, idx) => (
                    <HStack
                        justifyContent="space-between"
                        key={idx}
                        w="100%"
                        bg="primary.100:alpha.40"
                        p={APP_PADDING}
                        borderRadius={APP_PADDING}
                    >
                        <VStack space={1}>
                            <Text fontSize={'lg'} color={'primary.900'} bold>
                                {contact.name}
                            </Text>
                            <Text bold>{contact.phoneNumbers?.[0]?.number}</Text>
                        </VStack>
                        <HStack space={2}>
                            <IconButton icon={<MessageCircleIcon />}></IconButton>
                            <IconButton icon={<PhoneIcon style={{ transform: [{ scaleX: -1 }] }} />}></IconButton>
                        </HStack>
                    </HStack>
                ))}
            </VStack>
        </ScrollView>
    );
};
