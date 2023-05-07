import { Button } from "native-base";
import React from "react";

export const CButton = (props: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      colorScheme={"orange"}
      borderColor="orange.600"
      h="12"
      {...props}
    ></Button>
  );
};
