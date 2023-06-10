import { FormControl, Input } from "native-base";
import React from "react";

type Props = {
    label: string;
    error: string;
    obj: object
} & React.ComponentProps<typeof FormControl>;

export const CFormControl = (props: Props) => {
    const {label, error} = props;
  return (
    <FormControl  isRequired isInvalid={error.length > 0}>
    <FormControl.Label>{label}</FormControl.Label>
     {error.length > 0 ? <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage> : null}
</FormControl>
  );
};
