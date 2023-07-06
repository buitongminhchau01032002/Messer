/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavigatekey, AppTabsNavigationKey, AuthNavigationKey } from 'navigation/navigationKey';
import { MultiRoom, Room, SingleRoom } from 'screens/Message/type';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
// params type
export type AppTabsStackParamList = {
    [AppTabsNavigationKey.Contact]: undefined;
    [AppTabsNavigationKey.Message]: undefined;
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
    [RootNavigatekey.Information]: { email: string; password: string; phone: string };
    [RootNavigatekey.ChangeInfomation]: undefined;
    [RootNavigatekey.InformationQR]: undefined;
    [RootNavigatekey.MessageDetail]: {type: "single"|"multi" , room: SingleRoom};
    [RootNavigatekey.MessageManage]: {type: "single"|"multi" , room: SingleRoom};
    [RootNavigatekey.MultiRoomMessageDetail]: {type: "single"|"multi" , room: MultiRoom};
    [RootNavigatekey.MultiMessageManage]: {type: "single"|"multi" , room: MultiRoom};
    [RootNavigatekey.NotFound]: undefined;
    [RootNavigatekey.AddToMulti]: { roomId?: string };
    [RootNavigatekey.JoinWithLink]: { roomId?: string };
    [RootNavigatekey.Intro]: undefined;
    [RootNavigatekey.Modal]: undefined;
    [RootNavigatekey.ComingCall]: undefined;
    [RootNavigatekey.Calling]: undefined;
    [RootNavigatekey.CallWaiting]: undefined;
    [RootNavigatekey.Search]: undefined;
    [RootNavigatekey.QRScan]: undefined;
    [RootNavigatekey.Story]: { id: string; stories: [] };
    [RootNavigatekey.NewStory]: undefined;
    [RootNavigatekey.MyStory]: undefined;
    [RootNavigatekey.Notification]: undefined;
};
// props type
export type AppTabsStackScreenProps<Screen extends keyof AppTabsStackParamList> = CompositeScreenProps<
    BottomTabScreenProps<AppTabsStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;

// export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
>;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    Screen
>;
