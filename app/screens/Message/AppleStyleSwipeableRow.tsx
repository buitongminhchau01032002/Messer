import React, { Component, useRef } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';

import { RectButton, Swipeable } from 'react-native-gesture-handler';

export default (props) => {
    const swipeableRowRef = useRef()
    const renderRightAction = (text, color, x, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
        });
        const pressHandler = () => {
            close();
            alert(text);
        };
        return (
            <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
                <RectButton
                    style={[styles.rightAction, { backgroundColor: color }]}
                    onPress={pressHandler}>
                    <Text style={styles.actionText}>{text}</Text>
                </RectButton>
            </Animated.View>
        );
    };
    const renderRightActions = progress => (
        <View style={{ width: 192, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
            {renderRightAction('More', '#C8C7CD', 192, progress)}
            {renderRightAction('Flag', '#ffab00', 128, progress)}
            {renderRightAction('More', '#dd2c00', 64, progress)}
        </View>
    );

    const close = () => {
        swipeableRowRef.current?.close();
    };
    return (
        <Swipeable
            ref={swipeableRowRef}
            friction={2}
            leftThreshold={30}
            rightThreshold={20}
            renderRightActions={renderRightActions}>
            {props.children}
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: '#497AFC',
        justifyContent: 'center',
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
});
