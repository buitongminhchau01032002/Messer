import React, { useEffect, useState } from "react";
import { Box, Button, Center, FormControl, HStack, Heading, Input, Link, VStack, Text, Icon } from "native-base";
import { CButton } from "components/Button";
import { AppTabsStackScreenProps, AuthStackScreenProps } from "types";
import { AuthNavigationKey } from "navigation/navigationKey";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import { UserType } from "models/User";
import { Platform, Pressable } from "react-native";
import * as Yup from "yup";


export const SignUpScreen = (props: AuthStackScreenProps<AuthNavigationKey.SignUp>) => {

    const { navigation, route } = props
    const [isValidateOnChange, setIsValidateOnChange] = useState(false)

    useEffect(() => {
        navigation.setOptions({
            title: '',
            headerLeft: (props) =>
                <AntDesign name="arrowleft"
                    size={24}
                    onPress={() => navigation.navigate(AuthNavigationKey.SignIn)}
                />,
            headerShadowVisible: false,
        })
    }, [navigation])
    const [show, setShow] = React.useState(false);

    const initFormValue = {
        phoneNumber: "",
        email: "",
        password: "",
        platform: Platform.OS,
    };
    // schema validation
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const SignInSchema = Yup.object({
        phoneNumber: Yup.string()
            .matches(phoneRegExp, 'Phone Number is invalid!')
            .required('Phone number cannot be empty!'),

        email: Yup.string()
            .email("Invalid email format")
            .required("Email cannot be empty!"),

        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password cannot be empty!"),
    });
    return (
        <Box flex={1} w="100%" bg="white" alignItems="center">
            <Box safeArea p="2" w="90%" maxW="290">
                <Heading size="xl" fontWeight="bold" color="blue.900" _dark={{
                    color: "warmGray.50"
                }}>
                   OTP Sreen
                </Heading>


            </Box>
        </Box>
    )
}