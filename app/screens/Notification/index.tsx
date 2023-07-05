import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { Box, Button, Center, FormControl, HStack, Heading, Input, Link, VStack, Text, Icon, Switch } from "native-base";
import { CButton } from "components/Button";
import { AppTabsStackScreenProps, AuthStackScreenProps, RootStackScreenProps } from "types";
import { AuthNavigationKey, RootNavigatekey } from "navigation/navigationKey";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import { UserType } from "models/User";
import { Platform, Pressable } from "react-native";
import * as Yup from "yup";
import { APP_PADDING } from "app/constants/Layout";
//import OTPInputView from '@twotalltotems/react-native-otp-input'


export const NotificationScreen = (props: RootStackScreenProps<RootNavigatekey.Notification>) => {


    const { navigation, route } = props

    const [code, setCode] = useState("");
    const [pinReady, setPinready] = useState(false);
    const MAX_CODE_LENGTH = 4;

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Notification',
            headerTransparent: false,
        });
    }, [props.navigation]);


    return (
        <Box h="full" p={APP_PADDING} bg="white">
            <ScrollView  >
                <VStack space={2}>
                    <HStack flex={1} justifyContent={'space-between'}>
                        <Text>Notification</Text>
                        <Switch 
                        onValueChange={(e) => {

                        }}></Switch>
                    </HStack>
                </VStack>
            </ScrollView>
        </Box>
    );
}