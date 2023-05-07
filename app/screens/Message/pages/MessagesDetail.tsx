import { FontAwesome } from "@expo/vector-icons";
import { AppBar } from "components/AppBar";
import { Button, Center, Flex, Icon, Pressable, Text } from "native-base";
import {
  AppTabsNavigationKey,
  RootNavigatekey,
} from "navigation/navigationKey";
import React from "react";
import { useTranslation } from "react-i18next";
import { AppTabsStackScreenProps, RootStackScreenProps } from "types";

export const MessageDetailScreen = (
  props: RootStackScreenProps<RootNavigatekey.MessageDetail>
) => {
  const { t } = useTranslation();
  console.log(t("ahihi"));

  return (
    <Flex>
      <AppBar
        title={t("screen-title.message-detail")}
        bg="#2FA6DE"
        leftIcon={
          <Pressable px="2" pl="0" onPress={() => props.navigation.goBack()}>
            <Icon
              as={<FontAwesome name="arrow-left" />}
              size={6}
              color="white"
            />
          </Pressable>
        }
      />
      <Center h={"full"}>
        <Text>Welcome to Message Detail screen</Text>
      </Center>
    </Flex>
  );
};
