import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MicIcon } from 'components/Icons/Light/Mic';
import { TouchableOpacity } from 'components/TouchableOpacity';
import { View, Text, Center, HStack, VStack, Box } from 'native-base';
import React from 'react';

export const MyTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    return (
        <HStack style={{ height: 60 }} shadow={9} bg='white'>
            {
                state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;
                    const activeColor = options.tabBarActiveTintColor
                    const icon = options.tabBarIcon
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <VStack flex={1}>
                            <HStack>

                                <Box flex={0.5}></Box>
                                <Box h={1} borderBottomRadius={4} flex={1} bg={isFocused ? 'primary.900' : 'transparent'}></Box>
                                <Box flex={0.5}></Box>
                            </HStack>
                            <Center flex={1}>
                                <TouchableOpacity
                                    accessibilityState={isFocused ? { selected: true } : {}}
                                    testID={options.tabBarTestID}
                                    onPress={onPress}
                                    onLongPress={onLongPress}
                                >
                                    {/* <Text color="primary.900">
                                        {label}
                                    </Text> */}
                                    {icon({
                                        color: activeColor!,
                                        focused: isFocused,
                                        size: 0
                                    })}
                                </TouchableOpacity>
                            </Center>
                        </VStack>
                    );
                })
            }
        </HStack >
    );
}