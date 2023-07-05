import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabsStackParamList, RootStackScreenProps } from '../../types';
import { ContactScreen } from 'screens/Home';
import { MessageScreen } from 'screens/Message';
import { AppTabsNavigationKey, RootNavigatekey } from './navigationKey';
import { Avatar, Box, Button, Icon, View, useTheme } from 'native-base';
import { useBackgroundColor } from 'hooks/index';
import { AccountScreen } from 'screens/Account';
import { FakeScreen } from 'screens/FloatButton';
import { BudgetScreen } from 'screens/Budget';
import { MyTabBar } from './MyTabBar';
import { MicIcon } from 'components/Icons/Light/Mic';
import { MessageCircleIcon } from 'components/Icons/Light/Message';
import { BellIcon } from 'components/Icons/Light/Bell';
import { UserIcon } from 'components/Icons/Light/User';

const BottomTab = createBottomTabNavigator<AppTabsStackParamList>();

export default function AppTabsNavigator() {
    const { tabBarBackground } = useBackgroundColor();
    const { colors } = useTheme();
    return (
        <BottomTab.Navigator
            initialRouteName={AppTabsNavigationKey.Contact}
            tabBar={(props) => <MyTabBar {...props} />}
            screenOptions={{
                headerShadowVisible: false,
            }}
        >
            <BottomTab.Screen
                name={AppTabsNavigationKey.Contact}
                component={ContactScreen}
                options={{
                    title: AppTabsNavigationKey.Contact,
                    tabBarIcon: () => <MicIcon size='md' color='primary.900' />,
                }}
            />
            <BottomTab.Screen
                name={AppTabsNavigationKey.Message}
                component={MessageScreen}
                options={{
                    title: 'Channels',
                    tabBarIcon: () => <MessageCircleIcon size='md' color='primary.900' />,
                }}
            />
            {/* <BottomTab.Screen
                name={AppTabsNavigationKey.Budget}
                component={BudgetScreen}
                options={{
                    title: AppTabsNavigationKey.Budget,
                    tabBarIcon: () => <BellIcon size='md' color='primary.900' />,
                }}
            /> */}
            <BottomTab.Screen
                name={AppTabsNavigationKey.Account}
                component={AccountScreen}
                options={{
                    title: 'Account',
                    tabBarIcon: () => <UserIcon size='md' color='primary.900' />,
                }}
            />
        </BottomTab.Navigator>
    );
}
