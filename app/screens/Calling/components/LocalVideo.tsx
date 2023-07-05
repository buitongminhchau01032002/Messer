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
import { RTCView, MediaStream } from 'react-native-webrtc';
import { VideoOffIcon } from 'components/Icons/Light/VideoOff';
type ContextType = {
    translateX: number;
    translateY: number;
};

type LocalVideoPropsType = {
    stream: MediaStream | null;
    isOnVideo: boolean;
};

export function LocalVideo({ stream, isOnVideo }: LocalVideoPropsType) {
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
            if (translateY.value > SCREEN_DIMENSION.height - 200 - 174 - 40) {
                translateY.value = SCREEN_DIMENSION.height - 200 - 174 - 40;
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
        <GestureHandlerRootView style={{ width: '100%', top: 30, bottom: 174, position: 'absolute', zIndex: 99999 }}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={[rStyle]}>
                    <Box w={132} h={200} position="absolute" rounded="md" overflow="hidden" top="10" right="4">
                        {isOnVideo ? (
                            <RTCView
                                // @ts-ignore
                                streamURL={stream?.toURL() || ''}
                                objectFit="cover"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: 8,
                                }}
                                mirror
                            />
                        ) : (
                            <HStack justifyContent="center" alignItems="center" bg="gray.800" w={132} h={200}>
                                <VideoOffIcon size="16" color="white"/>
                            </HStack>
                        )}
                    </Box>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}
