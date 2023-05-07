import { FontAwesome } from "@expo/vector-icons";
import { localImages } from "app/constants/Images";
import { APP_PADDING } from "app/constants/Layout";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Icon,
  Modal,
  Pressable,
  VStack,
  Text,
  Popover,
} from "native-base";
import React, { useState } from "react";

export const DropDownSelect = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box position="relative" borderRadius="sm">
      <Popover
        isOpen={isOpen}
        placement="top right"
        onClose={() => setIsOpen(false)}
        trigger={(triggerProps) => {
          return (
            <Pressable {...triggerProps} onPress={() => setIsOpen(true)}>
              {({ isHovered, isFocused, isPressed }) => (
                <HStack
                  alignItems="center"
                  justifyContent="flex-end"
                  space="sm"
                  px="2"
                  py="1"
                  pr="0"
                  borderRadius="sm"
                  bg={
                    isPressed
                      ? "primary.700"
                      : isHovered
                      ? "primary.700"
                      : "transparent"
                  }
                >
                  <Avatar source={localImages.parentPlaceHoder} size="sm" />
                  <Icon
                    as={<FontAwesome name="sort-down" />}
                    size={4}
                    color="white"
                  />
                </HStack>
              )}
            </Pressable>
          );
        }}
      >
        <Popover.Content
          w="56"
          borderRadius="lg"
          overflow="hidden"
          borderWidth="0"
          shadow="1"
          top="1"
        >
          <Box>
            <VStack bg="white">
              <Box>
                <Pressable onPress={() => setIsOpen(false)}>
                  {({ isHovered, isFocused, isPressed }) => (
                    <HStack
                      p="2"
                      alignItems="center"
                      space="sm"
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <Avatar size="sm" source={localImages.parentPlaceHoder} />
                      <Text bold color="primary.900">
                        Phạm Quốc Toàn
                      </Text>
                    </HStack>
                  )}
                </Pressable>
                <Divider />
                <Pressable onPress={() => setIsOpen(false)}>
                  {({ isHovered, isFocused, isPressed }) => (
                    <HStack
                      p="2"
                      alignItems="center"
                      space="sm"
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "white"
                      }
                    >
                      <Avatar size="sm" source={localImages.parentPlaceHoder} />
                      <Text>Phạm Quốc Toàn</Text>
                    </HStack>
                  )}
                </Pressable>
              </Box>
            </VStack>
          </Box>
        </Popover.Content>
      </Popover>
    </Box>
  );
};
