import { APP_PADDING } from "app/constants/Layout";
import { Box, Image, Text, Center, Pressable } from "native-base";
import React from "react";
import { Dimensions, ImageSourcePropType } from "react-native";
type Props = {
  icon: ImageSourcePropType;
  text: string;
} & React.ComponentProps<typeof Box>;

export const BoxCategory = (props: Props) => {
  const { icon, text, ...hsProps } = props;
  const marginBox = 2;
  const getWidthOfBox = (numberOfColumns = 3) => {
    const screenWidth =
      Dimensions.get("window").width -
      APP_PADDING * 4 * 2 -
      marginBox * 4 * 2 * numberOfColumns; // 1p native-base = 4px react native
    return screenWidth / numberOfColumns;
  };
  return (
    <Pressable onPressIn={() => {}}>
      {({ isHovered, isFocused, isPressed }) => {
        return (
          <Center
            style={{ width: getWidthOfBox(), height: getWidthOfBox() }}
            borderRadius="sm"
            shadow={1}
            m={marginBox}
            bg={
              isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "white"
            }
            {...props}
          >
            <Box mb={1}>
              <Image source={icon} alt="..." w={8} h={8} />
            </Box>
            <Text fontSize="xs" fontWeight={600}>
              {text}
            </Text>
          </Center>
        );
      }}
    </Pressable>
  );
};
