import { FontAwesome } from "@expo/vector-icons";
import { APP_PADDING } from "app/constants/Layout";
import { CButton } from "components/Button";
import { PressableOpacity } from "components/PressableOpacity";
import {
  Modal,
  VStack,
  Text,
  Box,
  Pressable,
  CloseIcon,
  Button,
  HStack,
  Input,
  Icon,
} from "native-base";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOK?: (value?: string) => void;
  onCancel?: () => void;
  okButtonProps?: React.ComponentProps<typeof Button>;
  okButtonText?: string;
  title?: string;
  description?: string;
  options: { label: string; value: string }[];
  value: string;
} & React.ComponentProps<typeof Modal>;

export const SelectModal = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState<string>(props.value);
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      size="full"
      animationPreset="slide"
    >
      <Modal.Content
        borderRadius="0"
        style={{ marginBottom: 0, marginTop: "auto" }}
      >
        <Modal.Body p={APP_PADDING}>
          <VStack space="md">
            <Box position="relative">
              <Text fontSize="lg" textAlign="center" bold>
                {props.title ?? "Tilte"}
              </Text>
              <Pressable
                position="absolute"
                right="0"
                top="0"
                height="full"
                pl="4"
                onPress={() => {
                  props.onClose();
                  props.onCancel?.();
                }}
              >
                <VStack justifyContent="center" h="full">
                  <CloseIcon />
                </VStack>
              </Pressable>
            </Box>
            <Text fontSize="sm" textAlign="center">
              {props.description ?? "Description"}
            </Text>
            <VStack space={2}>
              {props.options.map((o, idx) => (
                <PressableOpacity
                  key={idx}
                  onPress={() => setSelectedValue(o.value)}
                >
                  <Input
                    InputRightElement={
                      o.value === selectedValue ? (
                        <Icon
                          as={<FontAwesome name="check" />}
                          size={4}
                          mr={4}
                          color="white"
                        />
                      ) : undefined
                    }
                    color={o.value === selectedValue ? "white" : "primary.900"}
                    isReadOnly
                    flex={1}
                    fontSize="sm"
                    value={o.label}
                    bg={o.value === selectedValue ? "primary.900" : undefined}
                    borderColor="primary.900"
                  ></Input>
                </PressableOpacity>
              ))}
            </VStack>
            <CButton
              _text={{
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "md",
              }}
              {...props.okButtonProps}
              onPress={() => {
                props.onClose();
                props.onOK?.(selectedValue);
              }}
            >
              {props.okButtonText ?? "OK"}
            </CButton>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
