import { NavigationContainer, NavigationContainerRef, CommonActions, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../../types';
import LinkingConfiguration from './LinkingConfiguration';
import AuthNavigator from './AuthNavigator';
import AppTabsNavigator from './AppTabsNavigator';
import React, { useEffect, useRef, useState } from 'react';
import { AuthNavigationKey, RootNavigatekey } from './navigationKey';
import { IntroScreen } from 'screens/Intro';
import { waitAsyncAction } from 'utils/async';
import { i18Config } from 'i18n/index';
import { useAppDispatch, useAppSelector } from 'hooks/index';
import { changeApplicationState } from 'slice/application';
import storage from 'services/storage';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { reLogin } from 'slice/auth';
import { MessageDetailScreen } from 'screens/Message/pages/MessagesDetail';
import { WalletScreen } from 'screens/Wallet';
import { ComingCallScreen } from 'screens/ComingCall';
import { CallingScreen } from 'screens/Calling';
import { CallWaitingScreen } from 'screens/CallWaiting';

export default function Navigation() {
    // hooks
    const dispatch = useAppDispatch();
    // action
    const loadingFont = async () => {
        await Font.loadAsync({
            ...FontAwesome.font,
            'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
        });
    };
    const loadingI18nSource = async () => {
        await i18n.use(initReactI18next).init(i18Config);
    };
    const prepare = async () => {
        await waitAsyncAction(2000);
        await loadingFont();
        await loadingI18nSource();
        // rehydrate
        const token = (await storage.get('token')) ?? '';
        dispatch(reLogin({ token: token }));
        dispatch(
            changeApplicationState({
                isAppReady: true,
            }),
        );
    };

    return (
        <NavigationContainer linking={LinkingConfiguration} onReady={prepare}>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    // hooks
    const isAppReady = useAppSelector((state) => state.application.isAppReady);
    const { isLogin } = useAppSelector((state) => state.auth);

    // console.log(isAppReady);
    if (!isAppReady) {
        return <IntroScreen />;
    }

    return (
        <Stack.Navigator>
            {isLogin ? (
                <Stack.Screen name={RootNavigatekey.Auth} component={AuthNavigator} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen
                        name={RootNavigatekey.AppTabs}
                        component={AppTabsNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name={RootNavigatekey.Wallet} component={WalletScreen} />
                </>
            )}
            <Stack.Group navigationKey={isLogin ? 'user' : 'guest'} screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen
                    name={RootNavigatekey.MessageDetail}
                    component={MessageDetailScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name={RootNavigatekey.Intro} component={IntroScreen} options={{ headerShown: false }} />
                <Stack.Screen name={RootNavigatekey.NotFound} component={NotFoundScreen} options={{ title: 'Oops!' }} />
                <Stack.Screen name={RootNavigatekey.Modal} component={ModalScreen} />
                <Stack.Screen name={RootNavigatekey.ComingCall} component={ComingCallScreen} options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: ''}} />
                <Stack.Screen name={RootNavigatekey.Calling} component={CallingScreen} options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: ''}} />
                <Stack.Screen name={RootNavigatekey.CallWaiting} component={CallWaitingScreen} options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: ''}} />
            </Stack.Group>
        </Stack.Navigator>
    );
}
