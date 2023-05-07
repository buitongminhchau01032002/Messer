import { Heading, Image } from "native-base";
import React from "react";
import { ImageSourcePropType } from "react-native";
type Props = {
  icon: ImageSourcePropType;
  label: string;
} & React.ComponentProps<typeof Heading>;

export const BoxHeading = (props: Props) => {
  const { icon, label, ...hsProps } = props;
  return (
    <Heading
      size="sm"
      mb={4}
      display="flex"
      alignItems="center"
      fontWeight={800}
      {...props}
    >
      {icon ? <Image source={icon} alt="..." w="24px" h="24px" mr={1} /> : ""}
      {label}
    </Heading>
  );
};
