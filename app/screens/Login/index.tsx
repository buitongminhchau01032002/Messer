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


export const LoginScreen = (props: AuthStackScreenProps<AuthNavigationKey.SignIn>) => {

    const { navigation, route } = props

    const [isValidateOnChange, setIsValidateOnChange] = useState(false)


    useEffect(() => {
        navigation.setOptions({
            headerRight: (props) =>
                <Text color="blue.900"
                    onPress={() => navigation.navigate(AuthNavigationKey.SignUp)}>
                    Sign up
                </Text>,
            title: '',
            headerLeft: (props) => <AntDesign name="arrowleft" size={24} />,
            headerShadowVisible: false,
        })
    }, [navigation])
    const [show, setShow] = React.useState(false);

    const initFormValue = {
        email: "",
        password: "",
        platform: Platform.OS,
    };
    // schema validation
    const SignInSchema = Yup.object({
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
                    Welcome
                </Heading>
                <Heading mt="1" mb="2" _dark={{
                    color: "warmGray.200"
                }} color="coolGray.600" fontWeight="medium" size="xs">
                    Sign in to continue!
                </Heading>


                <Formik
                    initialValues={initFormValue}
                    validationSchema={SignInSchema}
                    onSubmit={values => console.log(values)}
                    validateOnChange={isValidateOnChange}
                >
                    {({ handleSubmit, errors, values, validateForm, setFieldValue }) => (
                        <VStack h={340}>

                            <VStack space={4} mt="5" flex={1}>
                                <FormControl isInvalid={Boolean(errors.email)} h={90}>
                                    <FormControl.Label>Email Address</FormControl.Label>
                                    <Input
                                        autoCapitalize="none"
                                        value={values.email}
                                        onChangeText={(text) => setFieldValue("email", text)}
                                        placeholder=" Email"
                                        size='lg'
                                        color="primary.900"
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
                                <FormControl isInvalid={Boolean(errors.email)} h={90}>
                                    <FormControl.Label>Password</FormControl.Label>
                                    <Input
                                        value={values.password}
                                        onChangeText={(text) => setFieldValue("password", text)}
                                        placeholder="Password"
                                        size='lg'
                                        color="primary.900"
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
                                    <Link _text={{
                                        fontSize: "xs",
                                        fontWeight: "600",
                                        color: "indigo.500"
                                    }} alignSelf="flex-end" mt="2">
                                        Forget Password?
                                    </Link>
                                </FormControl>
                            </VStack>
                            <CButton onPress={() => {
                                setIsValidateOnChange(true)
                                validateForm().then(() => { })
                            }}>
                                Sign in
                            </CButton>
                        </VStack>

                    )}
                </Formik>


            </Box>
        </Box>
    )
}