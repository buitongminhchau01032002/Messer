import {
  Center,
  Icon,
  Pressable,
  Select,
  Text,
  useColorMode,
  VStack,
  HStack,
  Image,
  ScrollView,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from "react";

export const NavigateScreen = ({ m }: any) => {
  return (
    <VStack ml={2}>
      <TouchableOpacity onPress={m.onPress}>
        <HStack py={2} alignItems="center">
          <HStack space="lg" alignItems="center">
            {m.icon}
            <Text fontSize="md">{m.title}</Text>
          </HStack>
          <Center position="absolute" h="100%" right={0}>
            <Icon as={<FontAwesome />} name="chevron-right"></Icon>
          </Center>
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
};