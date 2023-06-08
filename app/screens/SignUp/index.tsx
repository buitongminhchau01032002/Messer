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
import { RootNavigatekey } from "navigation/navigationKey";
import { useAppDispatch } from "hooks/index";
import { reLogin } from "slice/auth";
import { auth } from "config/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";


export const SignUpScreen = (props: AuthStackScreenProps<AuthNavigationKey.SignUp>) => {

    // hooks
    const dispatch = useAppDispatch();

    const { navigation, route } = props
    const [isValidateOnChange, setIsValidateOnChange] = useState(false)


    function handleSignUp(values) {
        navigation.navigate(RootNavigatekey.Information, { email: values.email, password: values.password, phone: values.phoneNumber })
    }


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
       // platform: Platform.OS,
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
                    Sign Up
                </Heading>



                <Formik
                    initialValues={initFormValue}
                    validationSchema={SignInSchema}
                    onSubmit={values => handleSignUp(values)}
                    validateOnChange={isValidateOnChange}
                >
                    {({ handleSubmit, errors, values, validateForm, setFieldValue }) => (
                        <VStack h={400}>

                            <VStack space={4} mt="5" flex={1}>
                                <FormControl isInvalid={Boolean(errors.phoneNumber)} h={90}>
                                    <FormControl.Label>Phone Number</FormControl.Label>
                                    <Input
                                        autoCapitalize="none"
                                        value={values.phoneNumber}
                                        onChangeText={(text) => setFieldValue("phoneNumber", text)}
                                        placeholder="Phone Number"
                                        size='lg'
                                        color="blue.900"
                                        InputLeftElement={
                                            <Icon
                                                as={<MaterialIcons name="phone" />}
                                                size={5}
                                                ml="2"
                                                color="primary.900"
                                            />
                                        } />
                                    <FormControl.ErrorMessage>{errors.phoneNumber}</FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={Boolean(errors.email)} h={90}>
                                    <FormControl.Label>Email Address</FormControl.Label>
                                    <Input
                                        autoCapitalize="none"
                                        value={values.email}
                                        onChangeText={(text) => setFieldValue("email", text)}
                                        placeholder=" Email"
                                        size='lg'
                                        color="blue.900"
                                        InputLeftElement={
                                            <Icon
                                                as={<MaterialIcons name="mail" />}
                                                size={5}
                                                ml="2"
                                                color="primary.900"
                                            />
                                        } />
                                    <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={Boolean(errors.password)} h={90}>
                                    <FormControl.Label>Password</FormControl.Label>
                                    <Input
                                        value={values.password}
                                        onChangeText={(text) => setFieldValue("password", text)}
                                        placeholder="Password"
                                        size='lg'
                                        color="blue.900"
                                        InputLeftElement={
                                            <Icon
                                                as={<MaterialIcons name="lock" />}
                                                size={5}
                                                ml="2"
                                                color="primary.900"
                                            />
                                        }
                                        type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.900" />
                                        </Pressable>}
                                    />
                                    <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
                                </FormControl>
                            </VStack>
                            <CButton onPress={() => {
                                setIsValidateOnChange(true)
                                validateForm().then(() => {
                                    handleSubmit()
                                })
                            }}>
                                Sign up
                            </CButton>
                        </VStack>

                    )}
                </Formik>
            </Box>
        </Box>
    )
}