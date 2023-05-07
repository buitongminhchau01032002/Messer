import { Box, Icon, ScrollView, Spacer, Text, View } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";


type Props = {
    title: string,
    isActive: boolean,
    onPress: () => void
} & React.ComponentProps<typeof Box>;

export const TabItem = (props: Props) => {
    const { title, isActive, onPress } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <Text fontSize={'16'} paddingLeft={30} color={(isActive) ? 'black' : 'gray.400'}>{title} </Text>
        </TouchableOpacity>

    );
}