import React from "react";
import { Box, Image, Spinner, Text } from "native-base";
import { localImages } from "app/constants/Images";

export const IntroScreen = () => {
  return (
    <Box
      w="100%"
      h="100%"
      position={"relative"}
      alignItems="center"
      justifyContent={"center"}
    >
      {/* <Image
        source={localImages.bg}
        position="absolute"
        width={"100%"}
        height="100%"
        resizeMode="cover"
        alt="bg"
      /> */}
      {/* <Image source={localImages.logo2} mb='10' alt="logo"/> */}
      <Spinner size="lg" />
    </Box>
  );
};
