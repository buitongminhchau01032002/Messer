import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../types";
import { AuthNavigationKey } from "./navigationKey";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

    </Stack.Navigator>
  );
}
