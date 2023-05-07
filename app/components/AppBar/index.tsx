import { FontAwesome } from "@expo/vector-icons";
import { APP_PADDING } from "app/constants/Layout";
import { Box, Heading, HStack, Icon, IconButton, Pressable } from "native-base";
import React from "react";

type Props = {
  title: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  onPressDefaultLeftButton?: () => void;
} & React.ComponentProps<typeof HStack>;

export const AppBar = (props: Props) => {
  const { leftIcon, rightIcon, title, onPressDefaultLeftButton, ...hsProps } =
    props;
  return (
    <HStack
      px={APP_PADDING}
      py="2"
      pt="10"
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      {...hsProps}
      position="relative"
      zIndex={1}
    >
      <HStack alignItems="center" space="md">
        {leftIcon ? (
          leftIcon
        ) : (
          <Pressable px="2" pl="0" onPress={onPressDefaultLeftButton}>
            <Icon as={<FontAwesome name="bars" />} size={6} color="white" />
          </Pressable>
        )}

        <Heading textAlign="center" color="white">
          {title}
        </Heading>
      </HStack>
      {rightIcon && <Box alignItems="flex-end">{rightIcon}</Box>}
    </HStack>
  );
};
