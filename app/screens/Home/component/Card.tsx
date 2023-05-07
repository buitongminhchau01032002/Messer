import { Box, Image, Text, AspectRatio, Stack, Heading } from "native-base";
import React from "react";
import { ImageSourcePropType } from "react-native";
type Props = {
  img: ImageSourcePropType;
  title: string;
} & React.ComponentProps<typeof Box>;

export const Card = (props: Props) => {
  const { img, title, ...hsProps } = props;
  return (
    <Box {...props}>
      <Box mb={1} maxW="160px">
        {/* <AspectRatio w="100%" ratio={16 / 9} mb={1}>
          <Image source={img} alt="..." rounded={3} w="160px" h="105px" />
        </AspectRatio> */}
        <Box mb={1}>
          <Image source={img} alt="..." rounded={3} w="160px" h="105px" />
        </Box>
        <Stack>
          <Heading fontSize={"12"} mb={1}>
            {title}
          </Heading>
          <Text fontSize={"10"} opacity="0.7">
            15/03/2018
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};
