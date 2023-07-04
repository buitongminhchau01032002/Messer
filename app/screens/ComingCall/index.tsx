import React, { useEffect, useState, useCallback } from 'react';
import { Box, Center, HStack, IconButton, Image, Text, Toast, VStack, useTheme } from 'native-base';
import { runOnJS } from 'react-native-reanimated';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { PickupButton } from './components/PickupButton';
import { HangupButton } from './components/HangupButton';
import { PhoneIcon, PhoneOffIcon } from 'components/Icons/Light';
import sendCallMessage from 'utils/sendCallMessage';
import { useAppDispatch, useAppSelector } from 'hooks/index';
import { CallState, callActions } from 'slice/call';

const COMMING_CALL_TIMEOUT = 10000;

export const ComingCallScreen = (props: RootStackScreenProps<RootNavigatekey.ComingCall>) => {
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    // const [pickupButtonDragging, setPickupButtonDragging] = useState(false);
    // const [hangupButtonDragging, setHangupButtonDragging] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            handleRejectCall();
        }, COMMING_CALL_TIMEOUT);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: colors.white,
        });
    }, [props.navigation]);

    const callState = useAppSelector((state) => state.call);

    useEffect(() => {
        if (callState.state === CallState.NoCall) {
            props.navigation.goBack();
        }
    }, [callState]);

    // const handleOnPickupButtonDrag = useCallback(() => {
    //     'worklet';
    //     runOnJS(setPickupButtonDragging)(true);
    // }, []);

    // const handleOnPickupButtonDragEnd = useCallback(() => {
    //     'worklet';
    //     runOnJS(setPickupButtonDragging)(false);
    // }, []);

    // const handleOnHangupButtonDrag = useCallback(() => {
    //     'worklet';
    //     runOnJS(setHangupButtonDragging)(true);
    // }, []);

    // const handleOnHangupButtonDragEnd = useCallback(() => {
    //     'worklet';
    //     runOnJS(setHangupButtonDragging)(false);
    // }, []);

    function handleRejectCall() {
        sendCallMessage(callState.infor?.fromUser?.deviceToken, {
            type: 'reject',
            docId: callState.infor?.id,
        });
        props.navigation.goBack();
        dispatch(callActions.changeCallState(CallState.NoCall));
        dispatch(callActions.changeCallInfor(null));
        Toast.show({ description: 'Call ended!' });
    }

    function handleAcceptCall() {
        props.navigation.replace(RootNavigatekey.Calling);
    }

    return (
        <Box position="relative" flex={1}>
            <Box position="absolute" top="0" left="0" right="0" bottom="0">
                <Image
                    h="full"
                    w="full"
                    source={{
                        uri: callState.infor?.fromUser.avatar,
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
                        {callState.infor?.fromUser.name}
                    </Text>
                </Box>
                <Center>
                    <HStack
                        alignItems="center"
                        justifyContent="space-between"
                        style={{ width: 320 }}
                        // bg={(pickupButtonDragging || hangupButtonDragging) ? 'gray.200' : 'transparent'}
                    >
                        {/* <PickupButton
                            onDragStart={handleOnPickupButtonDrag}
                            onDragEnd={handleOnPickupButtonDragEnd}
                            isVisible={!hangupButtonDragging}
                        />
                        <HangupButton
                            onDragStart={handleOnHangupButtonDrag}
                            onDragEnd={handleOnHangupButtonDragEnd}
                            isVisible={!pickupButtonDragging}
                        /> */}
                        <IconButton
                            size={60}
                            bg="green.900"
                            rounded="full"
                            icon={<PhoneIcon size="lg" color="white" />}
                            onPress={handleAcceptCall}
                        />
                        <IconButton
                            size={60}
                            bg="primary.900"
                            rounded="full"
                            icon={<PhoneOffIcon size="lg" color="white" />}
                            onPress={handleRejectCall}
                        />
                    </HStack>
                </Center>
            </VStack>
        </Box>
    );
};
