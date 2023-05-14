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
import { Center, HStack, Text, useTheme } from 'native-base';
import { Feather, Ionicons } from '@expo/vector-icons';
type ContextType = {
    translateX: number;
};

type PickupButtonPropsType = {
    onDragStart: Function;
    onDragEnd: Function;
    isVisible: boolean;
};

export function PickupButton({ onDragStart, onDragEnd, isVisible }: PickupButtonPropsType) {
    const { colors } = useTheme();

    const translateX = useSharedValue(0);

    const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {
            context.translateX = translateX.value;
            onDragStart();
        },
        onActive: (event, context) => {
            translateX.value = event.translationX + context.translateX;
            if (translateX.value < 0) {
                translateX.value = 0;
            }
            if (translateX.value > 260) {
                translateX.value = 260;
            }
        },
        onEnd: () => {
            translateX.value = withSpring(0);
            onDragEnd()
        },
    });
    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
            ],
        };
    });
    return (
        <GestureHandlerRootView>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={[rStyle]}>
                    <HStack alignItems="center" space="1" >
                        {!isVisible ? <Center size={60} bg="primary.900" rounded="full" shadow="3" opacity={0.5}>
                            <Ionicons name="call-outline" size={28} color="white" style={{ transform: [{ scaleX: -1 }] }} />
                        </Center> : <>
                            <Center size={60} bg="green.900" rounded="full" shadow="3">
                                <Ionicons name="call-outline" size={28} color="white" />
                            </Center>
                            <Feather name="chevrons-right" size={24} color={colors.green[900]} />
                        </>}
                    </HStack>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}
