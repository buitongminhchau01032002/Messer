import React, { useEffect, useState } from 'react';
import { Box, Center, HStack, Image, Text, VStack, useTheme } from 'native-base';
import { runOnJS } from 'react-native-reanimated';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { PickupButton } from './components/PickupButton';
import { HangupButton } from './components/HangupButton';


export const ComingCallScreen = (props: RootStackScreenProps<RootNavigatekey.ComingCall>) => {
    const { colors } = useTheme();
    const [pickupButtonDragging, setPickupButtonDragging] = useState(false);
    const [hangupButtonDragging, setHangupButtonDragging] = useState(false);
    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.white,
        });
    }, [props.navigation]);

    function handleOnPickupButtonDrag() {
        'worklet';
        runOnJS(setPickupButtonDragging)(true);
    }

    function handleOnPickupButtonDragEnd() {
        'worklet';
        runOnJS(setPickupButtonDragging)(false);
    }

    function handleOnHangupButtonDrag() {
        'worklet';
        runOnJS(setHangupButtonDragging)(true);
    }

    function handleOnHangupButtonDragEnd() {
        'worklet';
        runOnJS(setHangupButtonDragging)(false);
    }

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
                <HStack
                    px="2"
                    alignItems="center"
                    justifyContent="space-between"
                    bg={(pickupButtonDragging || hangupButtonDragging) ? 'gray.200' : 'transparent'}
                >
                    <PickupButton
                        onDragStart={handleOnPickupButtonDrag}
                        onDragEnd={handleOnPickupButtonDragEnd}
                        isHidden={!hangupButtonDragging}
                    />
                    <HangupButton
                        onDragStart={handleOnHangupButtonDrag}
                        onDragEnd={handleOnHangupButtonDragEnd}
                        isHidden={!pickupButtonDragging}
                    />
                </HStack>
            </VStack>
        </Box>
    );
};
