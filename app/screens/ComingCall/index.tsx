import React, { useEffect } from 'react';
import { StyleSheet, Vibration } from 'react-native';
import { Box, Center, HStack, IconButton, Image, Text, Toast, VStack, useTheme } from 'native-base';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { RootStackScreenProps } from 'types';
import { RootNavigatekey } from 'navigation/navigationKey';
import { PickupButton } from './components/PickupButton';
import { HangupButton } from './components/HangupButton';
import { PhoneIcon, PhoneOffIcon, VideoIcon } from 'components/Icons/Light';
import sendCallMessage from 'utils/sendCallMessage';
import { useAppDispatch, useAppSelector } from 'hooks/index';
import { CallState, callActions } from 'slice/call';

// const COMMING_CALL_TIMEOUT = 10000;
const COMMING_CALL_TIMEOUT = 30000;

export const ComingCallScreen = (props: RootStackScreenProps<RootNavigatekey.ComingCall>) => {
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    // const [pickupButtonDragging, setPickupButtonDragging] = useState(false);
    // const [hangupButtonDragging, setHangupButtonDragging] = useState(false);
    useEffect(() => {
        Vibration.vibrate([2000, 1000], true);
        const timer = setTimeout(() => {
            handleRejectCall();
        }, COMMING_CALL_TIMEOUT);
        return () => {
            clearTimeout(timer);
            Vibration.cancel();
        };
    }, []);

    useEffect(() => {
        props.navigation.setOptions({
            headerBackVisible: false,
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
        sendCallMessage(callState.infor?.fromUser?.deviceToken, {
            type: 'accept',
            docId: callState.infor?.id,
        });
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
                <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="black:alpha.40" />
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
                        <Box size={70}>
                            <Ring delay={0} />
                            <Ring delay={250} />
                            <Ring delay={500} />
                            <IconButton
                                size={70}
                                bg="green.900"
                                rounded="full"
                                icon={<PickupIcon type={callState?.infor?.type} />}
                                onPress={handleAcceptCall}
                            />
                        </Box>
                        <IconButton
                            size={70}
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

const Ring = ({ delay }) => {
    const ring = useSharedValue(0);

    const ringStyle = useAnimatedStyle(() => {
        return {
            opacity: 0.8 - ring.value,
            transform: [
                {
                    scale: interpolate(ring.value, [0, 1], [0, 3]),
                },
            ],
        };
    });
    useEffect(() => {
        ring.value = withDelay(
            delay,
            withRepeat(
                withTiming(1, {
                    duration: 1600,
                }),
                -1,
                false,
            ),
        );
    }, []);
    return <Animated.View style={[styles.ring, ringStyle]} />;
};

const PickupIcon = ({ type }) => {
    const rotate = useSharedValue(0);

    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateZ: `${interpolate(
                        rotate.value,
                        [0, 1, 2, 3, 4, 5, 6, 7, 8],
                        [0, 15, -15, 15, -15, 15, -15, 15, 0],
                    )}deg`,
                },
            ],
        };
    });
    useEffect(() => {
        rotate.value = withRepeat(
            withTiming(8, {
                duration: 1600,
            }),
            -1,
            false,
        );
    }, []);
    return (
        <Animated.View style={[rotateStyle]}>
            {type === 'no-video' ? <PhoneIcon size="lg" color="white" /> : <VideoIcon size="10" color="white" />}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    ring: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 99999,
        borderColor: '#2BCEA0',
        borderWidth: 4,
    },
});
