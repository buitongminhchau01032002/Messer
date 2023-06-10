import React, { useState } from 'react';

import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Center, HStack, IconButton, Text, useTheme } from 'native-base';
import { Feather, Ionicons } from '@expo/vector-icons';
import { PhoneIcon, PhoneOffIcon } from 'components/Icons/Light';
type ContextType = {
    translateX: number;
};

type PickupButtonPropsType = {
    onDragStart: Function;
    onDragEnd: Function;
    isVisible: boolean;
    onPickup: () => void;
};

export function PickupButton({ onDragStart, onDragEnd, isVisible, onPickup }: PickupButtonPropsType) {
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
                onPickup();
            }
        },
        onEnd: () => {
            translateX.value = withSpring(0);
            onDragEnd();
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
                    <HStack alignItems="center" space="1">
                        {!isVisible ? (
                            <IconButton
                                size={60}
                                bg="primary.900"
                                rounded="full"
                                opacity={0.5}
                                icon={<PhoneOffIcon size="lg" color="white" />}
                            />
                        ) : (
                            <>
                                <IconButton
                                    size={60}
                                    bg="green.900"
                                    rounded="full"
                                    disabled
                                    icon={<PhoneIcon size="lg" color="white" />}
                                />
                                <Feather name="chevrons-right" size={24} color={colors.green[900]} />
                            </>
                        )}
                    </HStack>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}
