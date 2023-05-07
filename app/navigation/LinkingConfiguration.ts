/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "../../types";
import {
  AppDrawerNavigationKey,
  AppTabsNavigationKey,
  AuthNavigationKey,
  RootNavigatekey,
} from "./navigationKey";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      [RootNavigatekey.Auth]: {
        screens: {
          [AuthNavigationKey.SignIn]: "sign-in",
          [AuthNavigationKey.SignUp]: "sign-up",
        },
      },
      [RootNavigatekey.AppDrawer]: {
        screens: {
          [AppTabsNavigationKey.Home]: "home",
          [AppTabsNavigationKey.Message]: "message",
        },
      },
      [RootNavigatekey.Intro]: "intro",
      [RootNavigatekey.Modal]: "modal",
      [RootNavigatekey.NotFound]: "*",
    },
  },
};

export default linking;
