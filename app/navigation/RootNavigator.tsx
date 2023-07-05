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
import { reLogin, storeUserFromFirestore } from 'slice/auth';
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
import { MyStoryScreen } from 'screens/MyStory';
import { ChangeInformationScreen } from 'screens/ChangeInfomation';
import { QRScanScreen } from 'screens/QRScan';
import { NotificationScreen } from 'screens/Notification';
import { MessageManageScreen } from 'screens/Message/pages/MessageManage';

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
    const user = useAppSelector((state) => state.auth.user);

    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    // const { isLogin } = useAppSelector((state) => state.auth);
    const [isLogin, setIsLogin] = useState(auth.currentUser ? true : false);
    const callState = useAppSelector((state) => state.call);

    useEffect(() => {
        getToken();
        const unsubscribe = messaging().onMessage(async (payload: FirebaseMessagingTypes.RemoteMessage) => {
            // Vibration.vibrate([2000, 1000], true);
            console.log('🍟 Recieved messgage: ', payload.data);
            if (payload.data?.type === 'create') {
                handleRecievedCall(payload.data.docId);
            }
            if (payload.data?.type === 'reject') {
                handleEndCall();
            }
            if (payload.data?.type === 'cancel') {
                handleRecievedCancelCall(payload.data);
            }
            if (payload.data?.type === 'hangup') {
                handleEndCall();
            }
        });
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Message handled in the background!', remoteMessage);
        });

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('Notification caused app to open from background state:', remoteMessage);
        });

        return unsubscribe;
    }, [user, callState]);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user != null) {
                const userRef = doc(db, 'User', user.uid);
                const userSnap = await getDoc(userRef);
                const currentUser = {
                    id: user.uid,
                    ...userSnap.data(),
                };
                dispatch(storeUserFromFirestore(currentUser));
                setIsLogin(true);
            } else {
                setIsLogin(false);
            }
        });
    }, []);

    async function getToken() {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log('token', fcmToken);
        }
    }

    async function handleRecievedCall(docId: string) {
        const docSnap = await getDoc(doc(db, 'calls', docId));
        if (docSnap.exists()) {
            if (callState.state !== CallState.NoCall) {
                sendCallMessage(docSnap.data()?.fromUser?.deviceToken, {
                    type: 'reject',
                    docId: docSnap.id,
                });
                return;
            }

            // Check this call is correct user
            if (docSnap.data()?.toUser?.id === user?.id) {
                dispatch(callActions.changeCallInfor({ id: docSnap.id, ...docSnap.data() }));
                dispatch(callActions.changeCallState(CallState.Coming));
                navigation.navigate(RootNavigatekey.ComingCall);
            }
        }
    }

    function handleEndCall() {
        // In other call screens, handle state change to end call
        dispatch(callActions.changeCallInfor(null));
        dispatch(callActions.changeCallState(CallState.NoCall));
    }

    function handleRecievedCancelCall(data: any) {
        // Check call in message reject is correct call
        if (callState.state === CallState.Coming && callState.infor?.id === data?.docId) {
            dispatch(callActions.changeCallInfor(null));
            dispatch(callActions.changeCallState(CallState.NoCall));
        }
    }

    // Log
    useEffect(() => {
        console.log('🍍 State call:', callState.state);
        console.log('🍏 Call infor:', callState.infor && "Has call infor");
    }, [callState]);

    // signOut(auth)
    console.log(auth.currentUser?.email);
    if (!isAppReady) {
        return <IntroScreen />;
    }

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
                <Stack.Screen name={RootNavigatekey.ChangeInfomation} component={ChangeInformationScreen} />
                <Stack.Screen
                    name={RootNavigatekey.MessageDetail}
                    component={MessageDetailScreen}
                    options={{ headerShadowVisible: false }}
                />
                <Stack.Screen
                    name={RootNavigatekey.MessageManage}
                    component={MessageManageScreen}
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
                    name={RootNavigatekey.Notification}
                    component={NotificationScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />
                <Stack.Screen
                    name={RootNavigatekey.QRScan}
                    component={QRScanScreen}
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

                <Stack.Screen
                    name={RootNavigatekey.MyStory}
                    component={MyStoryScreen}
                    options={{ headerTransparent: true, headerShadowVisible: false, headerTitle: '' }}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
}
