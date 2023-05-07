import { Container, Box, Text, Flex, Avatar, Stack, VStack, Badge, Pressable, HStack, View } from "native-base";
import { APP_PADDING } from "app/constants/Layout";
import React from "react";
type Props = {
  title: string;
  text: string;
  isActive: boolean;
} & React.ComponentProps<typeof Box>;

export const MessageItem = (props: Props) => {
  const { title, text, isActive, ...hsProps } =
  props;
  return (
    <Stack direction="row" alignItems="center" space={4} px={APP_PADDING}>
      <VStack w={"50"}>
        <Badge
          colorScheme="danger" display="none" rounded="full" w={4} h={4} mb={-4} mr={-2} p={0} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
            fontSize: 12,
            fontWeight: 600,
          }}
          {...(isActive && {
            display: "flex",
          })}
          >
            2
        </Badge>
        <Avatar w={"50"} h={"50"} source={{
          uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
        }}>
          AJ
        </Avatar>
      </VStack>
      <VStack flex="1" space={1} py={APP_PADDING} borderBottomWidth={1} borderBottomColor={"#d8d8d8"} borderBottomStyle={"solid"}>
        <HStack alignItems="center" justifyContent="space-between">
          <Stack pr={2} flex="1">
            <Text isTruncated fontSize="sm" fontWeight="600">{title}</Text>
          </Stack>
          <Text fontSize={10} color={"#777"}>10:48</Text>
        </HStack>
        <Text fontSize="xs" isTruncated 
          {...(isActive && {
            fontWeight: "600",
          })}
        >{text}</Text>
      </VStack>
    </Stack>
  );
};
