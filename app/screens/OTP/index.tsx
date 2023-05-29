import React, { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';
import { Box, Button, Center, FormControl, HStack, Heading, Input, Link, VStack, Text, Icon } from "native-base";
import { CButton } from "components/Button";
import { AppTabsStackScreenProps, AuthStackScreenProps } from "types";
import { AuthNavigationKey } from "navigation/navigationKey";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import { UserType } from "models/User";
import { Platform, Pressable } from "react-native";
import * as Yup from "yup";
//import OTPInputView from '@twotalltotems/react-native-otp-input'


export const OTPScreen = (props: AuthStackScreenProps<AuthNavigationKey.OTP>) => {


    const { navigation, route } = props

    const [code, setCode] = useState("");
    const [pinReady, setPinready] = useState(false);
    const MAX_CODE_LENGTH = 4;

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



    return (
        <Box flex={1} w="100%" bg="white" alignItems="center">
            <Box safeArea p="2" w="90%" maxW="290">
                <Center>
                    <Heading size="xl" fontWeight="bold" color="blue.900" _dark={{
                        color: "warmGray.50"
                    }}>
                        OTP
                    </Heading>
                    <Heading mt="1" mb="2" _dark={{
                        color: "warmGray.200"
                    }} color="coolGray.600" fontWeight="medium" size="xs">
                        Enter the code we just sent to
                    </Heading>
                    <Heading mt="1" mb="2" _dark={{
                        color: "warmGray.200"
                    }} color="blue.900" fontWeight="bold" size="xs">
                        hello@deeper.one
                    </Heading>

                </Center>

                <VStack h={220}>
                    <VStack space={4}  flex={1} alignItems={"center"}>
                        
                        {/* <OTPInputView
                           selectionColor="#3498DB"
                            style={{ width: '80%' }}
                            pinCount={4}
                          
                            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                            // onCodeChanged = {code => { this.setState({code})}}
                            autoFocusOnLoad
                          
                            codeInputFieldStyle={styles.underlineStyleBase}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled={(code => {
                                console.log(`Code is ${code}, you are good to go!`)
                            })}
                        /> */}
                    </VStack>
                    <CButton >
                        Next
                    </CButton>
                </VStack>


            </Box>
        </Box>

    )
}
const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#3498DB",
    },

    underlineStyleBase: {
        width: 48,
        height: 48,
        borderWidth: 2,
        borderRadius: 10,
        color: "#3498DB",
        fontSize: 16,
        fontWeight: "bold",
    },

    underlineStyleHighLighted: {
        borderColor: "#3498DB",
    },
});