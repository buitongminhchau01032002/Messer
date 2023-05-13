import React, { useEffect, useState } from 'react';
import { Center, HStack, Image, Pressable, Text, VStack, useTheme } from 'native-base';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { Feather, Ionicons } from '@expo/vector-icons';

export const CallWaitingScreen = (props: RootStackScreenProps<RootNavigatekey.CallWaiting>) => {
    const { colors } = useTheme();
    const [isOnMic, setIsOnMic] = useState(true);
    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.primary[900],
            headerRight: () => (
                <HStack>
                    <Feather name="video" size={20} color={colors.primary[900]} />
                </HStack>
            ),
        });
    }, [props.navigation]);

    function handleToggleMic() {
        setIsOnMic(!isOnMic)
    }

    return (
        <VStack flex={1} bg="gray.800" justifyContent="space-between" pt="32">
            {/* Avatar and name... */}
            <VStack alignItems="center">
                <Image
                    size="40"
                    rounded="full"
                    source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                    alt="Avatar"
                />
                <Text color="white" mt="5" fontSize={24} fontWeight="bold">
                    Rahul Malviya
                </Text>
                <Text color="gray.300" mt="2" fontSize={12}>
                    Waiting...
                </Text>
            </VStack>

            {/* Button Action */}
            <HStack bg="amber.500" pb="20" pt="20" alignItems="center" justifyContent="center" space="10">
                {/* MIC */}
                <Pressable onPress={handleToggleMic}>
                    {isOnMic ? (
                        <Feather name="mic" size={24} color={colors.primary[900]} />
                    ) : (
                        <Feather name="mic-off" size={24} color={colors.primary[900]} />
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
                    <Feather name="volume" size={24} color={colors.primary[900]} />
                </Pressable>
            </HStack>
        </VStack>
    );
};
