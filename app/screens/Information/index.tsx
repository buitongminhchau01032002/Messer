import { createDrawerNavigator } from '@react-navigation/drawer';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import { DropDownSelect } from 'components/DropdownSelect';
import { BallotIcon } from 'components/Icons/Solid/Ballot';
import { RulerTriangleIcon } from 'components/Icons/Solid/RulerTriangle';
import { WalletIcon } from 'components/Icons/Solid/Wallet';
import { useAppDispatch } from 'hooks/index';
import React, { useEffect, useState } from 'react';
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
    View,
} from 'native-base';
import { AppTabsNavigationKey, AuthNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import { TouchableOpacity } from 'react-native';
import { AppTabsStackScreenProps, RootStackScreenProps } from 'types';
import { FontAwesome } from '@expo/vector-icons';
import { block } from 'react-native-reanimated';
import { localImages } from "../../constants/Images";
import * as ImagePicker from 'expo-image-picker';

type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const InformationScreen = (props: RootStackScreenProps<RootNavigatekey.Information>) => {
    // navigation
    const { navigation } = props;
    // hooks
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HStack
                    space={2}
                >
                    <Icon as={<FontAwesome />} name="hashtag" size={4} color={"blacks"} mr={2}></Icon>
                    <Icon as={<FontAwesome />} name="list" size={4} color={"blacks"} mr={5}></Icon>
                </HStack>
            ),
        });
    }, [props.navigation]);

    const menuItem: MenuItem[] = [
        {
            title: 'Nofication',
            icon: <Icon as={<FontAwesome />} name="bell" size="xl" color={"primary.900"} />,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),
        },
        {
            title: 'Pricacy and Security',
            icon: <Icon as={<FontAwesome />} name="shield" size="xl" color={"primary.900"} />,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),

        },
        {
            title: 'Theme',
            icon: <Icon as={<FontAwesome />} name="file" size="xl" color={"primary.900"}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),

        },
        {
            title: 'Language',
            icon: <Icon as={<FontAwesome />} name="globe" size="xl" color={"primary.900"}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),

        }
    ];
    const menuItem2: MenuItem[] = [
        {
            title: 'Direct share',
            icon: <Icon as={<FontAwesome />} name="share" size="xl" color={"primary.900"}></Icon>,
            onPress: () => navigation.navigate(RootNavigatekey.NotFound),


        },
    ];

    const [image, setImage] = useState('');

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            // setImage(result.assets[0].uri);
            console.log('set')
        }
    };


    return (
        <Box h="full" p={APP_PADDING} bg="white" >
            <ScrollView>
                <VStack space={2}>
                    <VStack space={2} mt={5} mb={10} >
                        <Center>

                            <TouchableOpacity onPress={pickImage}>
                                <VStack space={2} >
                                    <Center>
                                        <Image
                                            source={image ? { uri: image } : localImages.avatarPlaceholder}
                                            fallbackSource={localImages.driverPlaceHoder}
                                            style={{ width: 100, height: 100 }}
                                            alt='...'
                                            borderRadius={100}

                                        ></Image>
                                    </Center>


                                    <VStack space={2} ml={2} alignItems='center'>
                                        <Text bold fontSize={26}>
                                            Dennis
                                        </Text>
                                        <Text color="gray.400" fontSize={16}>hello@depper.com</Text>
                                    </VStack>
                                </VStack>
                            </TouchableOpacity>
                        </Center>
                    </VStack>
                    <Text fontSize="sm" my={2}>
                        Setting
                    </Text>
                    <VStack space={2}>
                        {menuItem.map((m, idx) => (
                            <VStack key={idx} ml={2}>
                                <TouchableOpacity onPress={m.onPress}>
                                    <HStack py={2} alignItems="center">
                                        <HStack space="lg" alignItems="center">
                                            {m.icon}
                                            <Text fontSize="md">{m.title}</Text>
                                        </HStack>
                                        <Center position="absolute" h="100%" right={0}>
                                            <Icon as={<FontAwesome />} name="chevron-right"></Icon>
                                        </Center>
                                    </HStack>
                                </TouchableOpacity>
                            </VStack>
                        ))}
                    </VStack>
                    <Text fontSize="sm" my={2}>
                        Message
                    </Text>
                    <VStack space={2}>
                        {menuItem2.map((m, idx) => (
                            <VStack key={idx} ml={2}>
                                <TouchableOpacity onPress={m.onPress}>
                                    <HStack py={2} alignItems="center">
                                        <HStack space="lg" alignItems="center">
                                            {m.icon}
                                            <Text fontSize="md">{m.title}</Text>
                                        </HStack>
                                        <Center position="absolute" h="100%" right={0}>
                                            <Icon as={<FontAwesome />} name="chevron-right"></Icon>
                                        </Center>
                                    </HStack>
                                </TouchableOpacity>
                            </VStack>
                        ))}
                    </VStack>
                </VStack>
            </ScrollView>
        </Box >
    );
};
