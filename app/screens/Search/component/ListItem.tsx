import { HStack, View, Image, Text, Pressable } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

export const ListItem = (item: { avatar: string, name: string, onPress?: () => void }) => (
    <Pressable onPress={item.onPress}>
        <View>
            <HStack space={6} alignItems={'center'} my = {2}>
                <Image
                    alt="..."
                    source={{ uri: item.avatar }}
                    size={16}
                    borderRadius={100}
                ></Image>
                <Text bold fontSize="md">
                    {item.name}
                </Text>
            </HStack>
            {/* <Divider/> */}
        </View>
    </Pressable>
    
);