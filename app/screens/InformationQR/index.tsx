import { APP_PADDING } from 'app/constants/Layout';
import React, { useEffect } from 'react';
import {
    Avatar,
    Box,
    Center,
    Icon,
    Text,
    VStack,
    HStack,
    ScrollView,
} from 'native-base';
import { RootNavigatekey } from 'navigation/navigationKey';
import { TouchableOpacity } from 'react-native';
import { RootStackScreenProps } from 'types';
import { FontAwesome } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from 'native-base';

type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const InformationScreenQR = (props: RootStackScreenProps<RootNavigatekey.InformationQR>) => {
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

    const { colors } = useTheme();


    return (
        <Box h="full" p={APP_PADDING} bg="white" >
            <ScrollView>
                <VStack space={2}>
                    <VStack space={2} mt={5} mb={10} >
                        <Center>

                            <TouchableOpacity>
                                <VStack space={2}>
                                    <Avatar size={200} bg="primary.900" ml={5} source={{
                                        uri: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
                                    }}>

                                        Sa Đam
                                    </Avatar>
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



                    <VStack space={2}>
                        <Center>

                            <QRCode
                                size={350}
                                color={colors.primary[900]}
                                value="Xin chào cả nhà iu"

                            />
                        </Center>
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>
    );
};
