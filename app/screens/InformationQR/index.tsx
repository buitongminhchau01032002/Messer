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
import { useAppSelector } from 'hooks/index';

type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const InformationScreenQR = (props: RootStackScreenProps<RootNavigatekey.InformationQR>) => {
    // navigation
    const { navigation } = props;
    const currentUser = useAppSelector((state) => state.auth.user);
    // hooks
    useEffect(() => {
        props.navigation.setOptions({
            
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
                                        uri: currentUser?.avatar
                                    }}>

                                        {currentUser?.name}
                                    </Avatar>
                                    <VStack space={2} ml={2} alignItems='center'>
                                        <Text bold fontSize={26}>
                                        {currentUser?.name}
                                        </Text>
                                        <Text color="gray.400" fontSize={16}>{currentUser?.email}</Text>
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
                                value={currentUser?.id}

                            />
                        </Center>
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>
    );
};
