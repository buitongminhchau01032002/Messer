import React from 'react';

import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Box, Center, HStack, Image, Text, useTheme } from 'native-base';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
type ContextType = {
    translateX: number;
    translateY: number;
};

type RemoteVideoPropsType = {};

export function RemoteVideo({}: RemoteVideoPropsType) {
    const { colors } = useTheme();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const SCREEN_DIMENSION = Dimensions.get('window');

    const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {
            context.translateX = translateX.value;
            context.translateY = translateY.value;
        },
        onActive: (event, context) => {
            translateX.value = event.translationX + context.translateX;
            if (translateX.value > 0) {
                translateX.value = 0;
            }
            if (translateX.value < -(SCREEN_DIMENSION.width - 132 - 32)) {
                translateX.value = -(SCREEN_DIMENSION.width - 132 - 32);
            }
            translateY.value = event.translationY + context.translateY;
            if (translateY.value < 0) {
                translateY.value = 0;
            }
            if (translateY.value > SCREEN_DIMENSION.height - 200 - 144 - 40) {
                translateY.value = SCREEN_DIMENSION.height - 200 - 144 - 40;
            }
        },
        onEnd: () => {
            // translateX.value = withSpring(0);
            // translateY.value = withSpring(0);
        },
    });
    const rStyle = useAnimatedStyle(() => {
        return {
            zIndex: 99999,
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
            ],
        };
    });
    return (
        <GestureHandlerRootView style={{ width: '100%', top: 0, bottom: 144, position: 'absolute', zIndex: 99999 }}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={[rStyle]}>
                    <Box w={132} h={200} position="absolute" top="10" right="4">
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
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}
