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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logout } from 'slice/auth';
import { AppTabsStackScreenProps } from 'types';

export const HomeScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Home>) => {
    // hooks
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { toggleColorMode } = useColorMode();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
    ]);
    const navigate = useNavigation();
    return (
        <Box h="full">
            
            <Box p={APP_PADDING} w="full" flex={1}>
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
                <Button onPress={() => navigate.navigate(RootNavigatekey.ComingCall)}>To coming call</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.Calling)}>To calling</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.CallWaiting)}>To call waiting</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.Story)}>To Story</Button>
                <Button onPress={() => navigate.navigate(RootNavigatekey.NewStory)}>To New Story</Button>
            </Box>
        </Box >
    );
};