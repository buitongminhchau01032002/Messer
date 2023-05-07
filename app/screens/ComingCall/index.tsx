import React, { useEffect } from 'react';
import { Box, Center, HStack, Image, NativeBaseProvider, Text, VStack, useTheme } from 'native-base';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { Feather, Ionicons } from '@expo/vector-icons';

export const ComingCallScreen = (props: RootStackScreenProps<RootNavigatekey.ComingCall>) => {
    const { colors } = useTheme();
    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.white,
        });
    }, [props.navigation]);

    return (
        <Box position="relative" flex={1}>
            <Box position="absolute" top="0" left="0" right="0" bottom="0">
                <Image
                    h="full"
                    w="full"
                    source={{
                        uri: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
                    }}
                    alt=""
                />
            </Box>
            <VStack px="7" pt="24" pb="24" justifyContent="space-between" h="full">
                <Box>
                    <Text color="primary.900" fontWeight="bold">
                        Coming call…
                    </Text>
                    <Text color="white" fontWeight="bold" fontSize="32">
                        Erika Mateo
                    </Text>
                </Box>
                <HStack px="2" alignItems='center' justifyContent='space-between'>
                    <HStack alignItems="center" space='1'>
                        <Center size={60} bg="green.900" rounded="full" shadow="3">
                            <Ionicons name="call-outline" size={28} color="white" />
                        </Center>
                        <Feather name="chevrons-right" size={24} color={colors.green[900]} />
                    </HStack>
                    <HStack alignItems="center" space='1'>
                        <Feather name="chevrons-left" size={24} color={colors.primary[900]} />
                        <Center size={60} bg="primary.900" rounded="full" shadow="3">
                            <Ionicons name="call-outline" size={28} color="white" />
                        </Center>
                    </HStack>
                </HStack>
            </VStack>
        </Box>
    );
};
