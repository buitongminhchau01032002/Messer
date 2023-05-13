import { Button } from "native-base";
import React from "react";

export const CButton = (props: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      h="12"
      {...props}
    ></Button>
  );
};
