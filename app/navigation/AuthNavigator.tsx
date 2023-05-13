import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../types";
import { AuthNavigationKey } from "./navigationKey";
import { LoginScreen } from "screens/Login";
import { SignUpScreen } from "screens/SignUp";
import { OTPScreen } from "screens/OTP";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={AuthNavigationKey.SignIn} component={LoginScreen} />
      <Stack.Screen name={AuthNavigationKey.SignUp} component={SignUpScreen} />
      <Stack.Screen name={AuthNavigationKey.OTP} component={OTPScreen} />
    </Stack.Navigator>
  );
}
