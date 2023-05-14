import { APP_PADDING } from "app/constants/Layout";
import { TouchableOpacity } from "components/TouchableOpacity";
import { Avatar, Box, Divider, HStack, HamburgerIcon, Menu, Pressable, Text, VStack } from "native-base";
import React, { useLayoutEffect, useRef } from "react";
import { View } from "react-native";
import { SendType } from "../type";
import { EllipsisIcon } from "components/Icons/Light";

type Props = {
  content: string;
  sendType: SendType;
  quote?: string;
  isFocus?: boolean;
  onLongPress?: () => void;
};
export const MessageItem = (props: Props) => {
  const { content, sendType, quote, isFocus = true, onLongPress } = props;
  useLayoutEffect(() => { }, []);
  if (sendType === SendType.Receive) {
    return (
      <HStack space="sm">
        <Avatar source={{ uri: "à dfa" }} size="sm"></Avatar>
        <TouchableOpacity maxWidth="70%" onLongPress={onLongPress}>
          <VStack borderRadius="md" p={APP_PADDING} bg="primary.900" space="2">
            {quote ? (
              <HStack
                bg="primary.200"
                p={APP_PADDING}
                space="sm"
                borderRadius={2}
              >
                <Divider
                  orientation="vertical"
                  thickness={2}
                  bg="primary.900"
                ></Divider>
                <VStack flex={1} w="100%">
                  <Text bold color="white" fontSize="xs">
                    Name
                  </Text>
                  <Text numberOfLines={2} fontSize="xs">
                    We provide a set of commonly used interface icons which you
                    can directly use in your project. All our icons are create
                    using createIcon function from NativeBase. We provide a set
                    of commonly used interface icons which you can directly use
                    in your project. All our icons are create using createIcon
                    function from NativeBase.
                  </Text>
                </VStack>
              </HStack>
            ) : undefined}
            <Text color="white">{content}</Text>
          </VStack>
        </TouchableOpacity>
        <HStack flex={1} alignItems='flex-end' >
          {isFocus ? <Menu mb={2} placement="top right" trigger={triggerProps => {
            return <TouchableOpacity p={1} bg='gray.100' borderRadius={100} {...triggerProps}>
              <EllipsisIcon color='primary.900' size='md' />
            </TouchableOpacity>
          }}>
            <Menu.Item onPress={() => console.log('abdf')}><Text bold fontSize='md'>Forward</Text></Menu.Item>
            <Menu.Item><Text bold fontSize='md'>Copy</Text></Menu.Item>
            <Menu.Item><Text bold fontSize='md' color='primary.900'>Remove</Text></Menu.Item>
          </Menu> : undefined}
        </HStack>
      </HStack >
    );
  } else {
    return (
      <HStack space="sm">
        <HStack flex={1} alignItems='flex-end' justifyContent='flex-end' >
          {isFocus ? <Menu mb={2} placement="top right" trigger={triggerProps => {
            return <TouchableOpacity p={1} bg='gray.100' borderRadius={100} {...triggerProps}>
              <EllipsisIcon color='primary.900' size='md' />
            </TouchableOpacity>
          }}>
            <Menu.Item onPress={() => console.log('abdf')}><Text bold fontSize='md'>Forward</Text></Menu.Item>
            <Menu.Item><Text bold fontSize='md'>Copy</Text></Menu.Item>
            <Menu.Item><Text bold fontSize='md' color='primary.900'>Remove</Text></Menu.Item>
          </Menu> : undefined}
        </HStack>
        <TouchableOpacity maxWidth="70%" onLongPress={onLongPress}>
          <VStack borderRadius="md" p={APP_PADDING} bg="blue.900" space="2">
            {quote ? (
              <HStack
                bg="blue.200"
                p={APP_PADDING}
                space="sm"
                borderRadius={2}
              >
                <Divider
                  orientation="vertical"
                  thickness={2}
                  bg="blue.900"
                ></Divider>
                <VStack flex={1} w="100%">
                  <Text bold color="white" fontSize="xs">
                    Name
                  </Text>
                  <Text numberOfLines={2} fontSize="xs">
                    We provide a set of commonly used interface icons which you
                    can directly use in your project. All our icons are create
                    using createIcon function from NativeBase. We provide a set
                    of commonly used interface icons which you can directly use
                    in your project. All our icons are create using createIcon
                    function from NativeBase.
                  </Text>
                </VStack>
              </HStack>
            ) : undefined}
            <Text color="white">{content}</Text>
          </VStack>
        </TouchableOpacity>
      </HStack>
    );
  }
};
