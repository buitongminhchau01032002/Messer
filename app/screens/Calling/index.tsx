import React, { useEffect, useState } from 'react';
import { Box, Center, HStack, Image, NativeBaseProvider, Text, VStack, useTheme } from 'native-base';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export const CallingScreen = (props: RootStackScreenProps<RootNavigatekey.Calling>) => {
    const { colors } = useTheme();
    const [isOnMic, setIsOnMic] = useState(true);

    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.primary[900],
        });
    }, [props.navigation]);

    function handleToggleMic() {
        setIsOnMic(!isOnMic)
    }

    return (
        <Box position="relative" flex={1}>
            <Box position="absolute" top="0" left="0" right="0" bottom="0">
                {/* VIDEO CALL */}
                <Image
                    h="full"
                    w="full"
                    source={{
                        uri: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
                    }}
                    alt=""
                />
            </Box>
            <Box position="absolute" top="10" w={132} h={200} right="4" bottom="0">
                {/* VIDEO CALL */}
                <Image
                    h="full"
                    w="full"
                    shadow="3"
                    rounded="lg"
                    source={{
                        uri: 'https://images.unsplash.com/photo-1504199367641-aba8151af406?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
                    }}
                    alt=""
                />
            </Box>
            <VStack px="7" pt="24" pb="24" justifyContent="space-between" h="full">
                <Box>
                    <Text color="primary.900" fontWeight="bold" fontSize="32">
                        Erika
                    </Text>
                </Box>
                <HStack alignItems="center" justifyContent="center" space="10">
                    {/* MIC */}
                    <Pressable onPress={handleToggleMic}>
                        {isOnMic ? (
                            <Feather name="mic" size={24} color={colors.white} />
                        ) : (
                            <Feather name="mic-off" size={24} color={colors.white} />
                        )}
                    </Pressable>
                    {/* HANGUP */}
                    <Pressable>
                        <Center size="20" rounded="full" justifyContent="center" alignItems="center" bg="primary.900">
                            <Ionicons name="call-outline" size={30} color="white" />
                        </Center>
                    </Pressable>
                    {/* VOLUME */}
                    <Pressable>
                        <Feather name="volume" size={24} color={colors.white} />
                    </Pressable>
                </HStack>
            </VStack>
        </Box>
    );
};
