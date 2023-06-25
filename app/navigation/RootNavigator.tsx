import {
    NavigationContainer,
    NavigationContainerRef,
    CommonActions,
    StackActions,
    useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

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
import { Alert } from 'react-native';
import { MessageDetailScreen } from 'screens/Message/pages/MessagesDetail';
import { WalletScreen } from 'screens/Wallet';
import { Box } from 'native-base';
import { ComingCallScreen } from 'screens/ComingCall';
import { CallingScreen } from 'screens/Calling';
import { CallWaitingScreen } from 'screens/CallWaiting';
import { SearchScreen } from 'screens/Search';
import { InformationScreen } from 'screens/Information';
import { InformationScreenQR } from 'screens/InformationQR';
import { PermissionsAndroid } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import { CallState, callActions } from 'slice/call';
import sendCallMessage from 'utils/sendCallMessage';
import { auth } from 'config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { StoryScreen } from 'screens/Story';
import { NewStoryScreen } from 'screens/NewStory';
import { MultiRoomMessageDetailScreen } from 'screens/Message/pages/MultiRoomMessagesDetail';
import { AddToMultiRoomScreen } from 'screens/Message/pages/AddToMultiRoom';

export default function Navigation() {
    // hooks
    const dispatch = useAppDispatch();
    // action
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const loadingFont = async () => {
        await Font.loadAsync({
            ...FontAwesome.font,
            Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
        });
    };
    const loadingI18nSource = async () => {
        await i18n.use(initReactI18next).init(i18Config);
    };
    const prepare = async () => {
        //await waitAsyncAction(2000);
        await loadingFont();
        await loadingI18nSource();
        // rehydrate
        const token = (await storage.get('token')) ?? '';
        // dispatch(reLogin({ token: token }));

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
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    // const { isLogin } = useAppSelector((state) => state.auth);
    const [isLogin, setIsLogin] = useState(auth.currentUser ? true : false);
    const callState = useAppSelector((state) => state.call);

    useEffect(() => {
        getToken();
        const unsubscribe = messaging().onMessage(async (payload: FirebaseMessagingTypes.RemoteMessage) => {
            // Vibration.vibrate([2000, 1000], true);
            if (payload.data?.type === 'create') {
                handleRecievedCall(payload.data.docId);
            }
            if (payload.data?.type === 'reject') {
                // handleEndCall();
            }
            if (payload.data?.type === 'cancel') {
                // handleRecievedCancelCall(payload.data);
            }
            if (payload.data?.type === 'hangup') {
                // handleEndCall();
            }
            console.log('🍟 Recieved messgage: ', payload.data);
        });
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Message handled in the background!', remoteMessage);
        });

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('Notification caused app to open from background state:', remoteMessage);
        });

        return unsubscribe;
    }, []);
    async function getToken() {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log(fcmToken);
        }
    }

    async function handleRecievedCall(docId: string) {
        const docSnap = await getDoc(doc(db, 'calls', docId));
        if (docSnap.exists()) {
            if (callState.state !== CallState.NoCall) {
                sendCallMessage(docSnap.data()?.fromUser?.device, {
                    type: 'reject',
                    docId: docSnap.id,
                });
                return;
            }

            // TODO: check toUser is correct current user
            // if (docSnap.data()?.toUser?.id === user?.id) {
            //
            // }
            if (true) {
                navigation.navigate(RootNavigatekey.ComingCall);
                dispatch(callActions.changeCallInfor({ id: docSnap.id, ...docSnap.data() }));
                dispatch(callActions.changeCallState(CallState.Coming));
            }
        }
    }

    // Log
    useEffect(() => {
        console.log('🍍 State call:', callState.state);
        console.log('🍏 Call infor:', callState.infor);
    }, [callState]);

    // signOut(auth)
    console.log(auth.currentUser?.email);
    if (!isAppReady) {
        return <IntroScreen />;
    }

    onAuthStateChanged(auth, (user) => {
        console.log('current user', user?.email);
        if (user) {
            setIsLogin(true);
        } else {
            // setIsLogin(false);
            setIsLogin(true);
        }
    });
    return (
        <Stack.Navigator>
            {!isLogin ? (
                <Stack.Screen name={RootNavigatekey.Auth} component={AuthNavigator} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen
                        name={RootNavigatekey.AppTabs}
                        component={AppTabsNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name={RootNavigatekey.Wallet} component={WalletScreen} />
                    <Stack.Screen name={RootNavigatekey.InformationQR} component={InformationScreenQR} />
                </>
            )}
            <Stack.Group navigationKey={isLogin ? 'user' : 'guest'}>
                <Stack.Screen name={RootNavigatekey.Information} component={InformationScreen} />
                <Stack.Screen
                    name={RootNavigatekey.MessageDetail}
                    component={MessageDetailScreen}
                    options={{ headerShadowVisible: false }}
                />
                 <Stack.Screen
                    name={RootNavigatekey.MultiRoomMessageDetail}
                    component={MultiRoomMessageDetailScreen}
                    options={{ headerShadowVisible: false }}
                />
                <Stack.Screen name={RootNavigatekey.Intro} component={IntroScreen} options={{ headerShown: false }} />
                <Stack.Screen name={RootNavigatekey.NotFound} component={NotFoundScreen} options={{ title: 'Oops!' }} />
                <Stack.Screen name={RootNavigatekey.Modal} component={ModalScreen} />

                <Stack.Screen
                    name={RootNavigatekey.Calling}
                    component={CallingScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />
                <Stack.Screen
                    name={RootNavigatekey.CallWaiting}
                    component={CallWaitingScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />
                <Stack.Screen
                    name={RootNavigatekey.ComingCall}
                    component={ComingCallScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />
                <Stack.Screen
                    name={RootNavigatekey.Search}
                    component={SearchScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />
                 <Stack.Screen
                    name={RootNavigatekey.AddToMulti}
                    component={AddToMultiRoomScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />
                <Stack.Screen
                    name={RootNavigatekey.Story}
                    component={StoryScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />

                <Stack.Screen
                    name={RootNavigatekey.NewStory}
                    component={NewStoryScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
}
