import React, { useEffect, useState } from 'react';
import { Box, Center, HStack, IconButton, Image, NativeBaseProvider, Text, VStack, useTheme } from 'native-base';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { RemoteVideo } from './components/RemoteVideo';
import { MicIcon, MicOffIcon, PhoneIcon } from 'components/Icons/Light';

export const CallingScreen = (props: RootStackScreenProps<RootNavigatekey.Calling>) => {
    const { colors } = useTheme();
    const [isOnMic, setIsOnMic] = useState(true);

    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.primary[900],
        });
    }, [props.navigation]);

    function handleToggleMic() {
        console.log('sadfasdf');
        setIsOnMic(!isOnMic);
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
            <RemoteVideo />
            <VStack px="7" pt="24" pb="20" justifyContent="space-between" h="full">
                <Box>
                    <Text color="primary.900" fontWeight="bold" fontSize="32">
                        Erika
                    </Text>
                </Box>
                <HStack alignItems="center" justifyContent="center" space="10">
                    {/* MIC */}
                    <IconButton
                        onPress={handleToggleMic}
                        size={12}
                        bg="gray:900:alpha.50"
                        rounded="full"
                        icon={isOnMic ? <MicIcon size="lg" color="white" /> : <MicOffIcon size="lg" color="white" />}
                    />
                    {/* HANGUP */}
                    <Pressable>
                        <IconButton
                            size="20"
                            rounded="full"
                            bg="primary.900"
                            icon={<PhoneIcon size="xl" color="white" />}
                        />
                    </Pressable>
                    {/* VOLUME */}
                    <IconButton
                        size={12}
                        bg="gray:900:alpha.50"
                        rounded="full"
                        icon={
                            isOnMic ? (
                                <Feather name="volume" size={24} color={colors.white} />
                            ) : (
                                <Feather name="volume" size={24} color={colors.white} />
                            )
                        }
                    />
                </HStack>
            </VStack>
        </Box>
    );
};
