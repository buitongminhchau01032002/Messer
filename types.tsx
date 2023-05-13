/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    RootNavigatekey,
    AppTabsNavigationKey,
    AuthNavigationKey,
} from 'navigation/navigationKey';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
// params type
export type AppTabsStackParamList = {
    [AppTabsNavigationKey.Home]: undefined;
    [AppTabsNavigationKey.Message]: undefined;
    [AppTabsNavigationKey.FloatButton]: undefined;
    [AppTabsNavigationKey.Budget]: undefined;
    [AppTabsNavigationKey.Account]: undefined;
};

export type AuthStackParamList = {
    [AuthNavigationKey.SignIn]: undefined;
    [AuthNavigationKey.SignUp]: undefined;
    [AuthNavigationKey.OTP]: undefined;
};

export type RootStackParamList = {
    [RootNavigatekey.AppTabs]: NavigatorScreenParams<AppTabsStackParamList> | undefined;
    [RootNavigatekey.Auth]: NavigatorScreenParams<AuthStackParamList> | undefined;
    [RootNavigatekey.Wallet]: undefined;
    [RootNavigatekey.MessageDetail]: undefined;
    [RootNavigatekey.NotFound]: undefined;
    [RootNavigatekey.Intro]: undefined;
    [RootNavigatekey.Modal]: undefined;
};
// props type
export type AppTabsStackScreenProps<Screen extends keyof AppTabsStackParamList> = CompositeScreenProps<
    BottomTabScreenProps<AppTabsStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    Screen
>;
