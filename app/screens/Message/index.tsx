import { AppBar } from "components/AppBar";
import { Button, Center, Flex, Stack } from "native-base";
import { AppTabsNavigationKey, RootNavigatekey } from "navigation/navigationKey";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { AppTabsStackScreenProps } from "types";
import { MessageItem } from "./components/MessageItem";

export const MessageScreen = (
  props: AppTabsStackScreenProps<AppTabsNavigationKey.Message>
) => {
  const { t } = useTranslation();
  console.log(t("ahihi"));

  return (
    <Flex>
      <AppBar
        title={t("screen-title.message")}
        bg="#2FA6DE"
        onPressDefaultLeftButton={() => props.navigation.openDrawer()}
      />
      <Stack>
        <ScrollView>
          <MessageItem title="Hannah Baker Hannah Baker Hannah Baker Hannah Baker Hannah Baker Hannah Baker Hannah Baker" text="Today, kid goes to school very well, this is Today, kid goes to school very well, this is" isActive={true} />
          <MessageItem title="Emily Lover" text="You: Can you go to meetings at the weekend?" isActive={false} />
          <MessageItem title="Rabbit classes" text="You: Can you go to meetings at the weekend?" isActive={false} />
          <MessageItem title="Elena Kosh (assistant principals)" text="Your kid are sick, you need to pay more att…" isActive={false} />
          <Button
            onPress={() => {
              props.navigation.navigate(RootNavigatekey.MessageDetail);
            }}
          >
            Navigate to Message Detail (Message of specific user)
          </Button>
        </ScrollView>
      </Stack>
    </Flex>
  );
};
