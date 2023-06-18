import { createDrawerNavigator } from '@react-navigation/drawer';
import { APP_PADDING } from 'app/constants/Layout';
import { AppBar } from 'components/AppBar';
import { DropDownSelect } from 'components/DropdownSelect';
import { BallotIcon } from 'components/Icons/Solid/Ballot';
import { RulerTriangleIcon } from 'components/Icons/Solid/RulerTriangle';
import { WalletIcon } from 'components/Icons/Solid/Wallet';
import { useAppDispatch } from 'hooks/index';
import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Center,
    CheckIcon,
    Container,
    Flex,
    Icon,
    IconButton,
    Pressable,
    Select,
    Text,
    useColorMode,
    VStack,
    HStack,
    Image,
    ScrollView,
    View,
    FormControl,
    Input,
} from 'native-base';
import { AppTabsNavigationKey, AuthNavigationKey, RootNavigatekey } from 'navigation/navigationKey';
import { Platform, TouchableOpacity } from 'react-native';
import { AppTabsStackScreenProps, RootStackScreenProps } from 'types';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { block } from 'react-native-reanimated';
import { localImages } from "../../constants/Images";
import * as ImagePicker from 'expo-image-picker';
import * as Yup from "yup";
import { Formik } from 'formik';
import { CButton } from 'components/Button';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from 'config/firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import messaging from '@react-native-firebase/messaging';

type MenuItem = {
    title: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
    onPress?: () => void;
};

export const InformationScreen = (props: RootStackScreenProps<RootNavigatekey.Information>) => {
    // navigation
    const { email, password, phone } = props.route.params
    const { navigation } = props;
    const [isValidateOnChange, setIsValidateOnChange] = useState(false)
    const initFormValue = {
        fullName: "",
        gender: "",
        platform: Platform.OS,
    };
    const [imageUrl, setImageUrl] = useState('');

    // hooks
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HStack
                    space={2}
                >
                    <Icon as={<FontAwesome />} name="hashtag" size={4} color={"blacks"} mr={2}></Icon>
                    <Icon as={<FontAwesome />} name="list" size={4} color={"blacks"} mr={5}></Icon>
                </HStack>
            ),
        });
    }, [props.navigation]);



    // schema validation
    const SignInSchema = Yup.object({
        fullName: Yup.string()
            .required("Full name cannot be empty!"),
        gender: Yup.string()
            .required("Please choose your gender!"),

    });

    async function handleSuccessSignIn(values) {
        // const deviceToken = await getToken(messaging, { vapidKey: "BJJdsMAPga6bGAvN4k-pBmeEU9NZbuCD-k_-vZdUUruF-QmsO0oOTjTs9Nu27x7FNIyDuKPu_EhPEi2wZ4q6h5A" } )
        if (!auth.currentUser) {

            const deviceToken = await messaging().getToken()
            //upload avatar
            const imgResponse = await fetch(imageUrl)
            const blob = await imgResponse.blob()
            const name = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
            const storageRef = ref(storage, "images/".concat(name));

            
            uploadBytes(storageRef, blob).then((snapshot) => {
                getDownloadURL(storageRef)
                .then((url) => {
                    createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        console.log(userCredential.user.uid)
                        setDoc(doc(db, "User", userCredential.user.uid), {
                            avatar: url,
                            email: email,
                            name: values.fullName,
                            gender: values.gender,
                            phone: phone,
                            deviceToken: deviceToken
                        });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error
                    });
                  
                })
                
            });

            
        } else {
            console.log("update")
        }

        // navigation.replace(RootNavigatekey.Auth, { screen: AuthNavigationKey.SignIn });

    }


    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };


    return (
        <Box h="full" p={APP_PADDING} bg="white" >
            <ScrollView>
                <VStack space={2}>
                    <VStack space={2} mt={5} mb={10} >
                        <Center>

                            <TouchableOpacity onPress={pickImage}>
                                <VStack space={2} >
                                    <Center>
                                        <Image
                                            source={imageUrl ? { uri: imageUrl } : localImages.avatarPlaceholder}
                                            fallbackSource={localImages.driverPlaceHoder}
                                            style={{ width: 100, height: 100 }}
                                            alt='...'
                                            borderRadius={100}

                                        ></Image>
                                    </Center>
                                </VStack>
                            </TouchableOpacity>
                            <VStack space={2} ml={2} alignItems='center'>
                                <Text bold fontSize={26}>
                                    Dennis
                                </Text>
                                <Text color="gray.400" fontSize={16}>hello@depper.com</Text>
                            </VStack>
                        </Center>
                    </VStack>
                    <Formik
                        initialValues={initFormValue}
                        validationSchema={SignInSchema}
                        onSubmit={values => handleSuccessSignIn(values)}
                        validateOnChange={isValidateOnChange}
                    >
                        {({ handleSubmit, errors, values, validateForm, setFieldValue }) => (
                            <VStack h={340}>

                                <VStack space={4} mt="5" flex={1}>
                                    <FormControl isRequired isInvalid={Boolean(errors.fullName)} h={90}>
                                        <FormControl.Label>Full name</FormControl.Label>
                                        <Input
                                            autoCapitalize="none"
                                            value={values.fullName}
                                            onChangeText={(text) => setFieldValue("fullName", text)}
                                            placeholder="ex: Hoang Tran"
                                            size='lg'
                                            color="blue.900"

                                        />
                                        <FormControl.ErrorMessage>{errors.fullName}</FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl isRequired isInvalid={Boolean(errors.gender)} h={90}>
                                        <FormControl.Label>Gender</FormControl.Label>
                                        {/* <Input
                                            autoCapitalize="none"
                                            value={values.gender}
                                            onChangeText={(text) => setFieldValue("gender", text)}
                                            placeholder="ex: Hoang Tran"
                                            size='lg'
                                            color="blue.900"
                                            
                                            /> */}
                                        <Select minWidth="200" accessibilityLabel="Choose your gender" placeholder="Choose your gender" size='lg' color="blue.900"
                                            selectedValue={values.gender}
                                            onValueChange={(text: any) => setFieldValue("gender", text)}

                                            _selectedItem={{
                                                endIcon: <CheckIcon size={5} />
                                            }} mt="1">
                                            <Select.Item label="Male" value="male" />
                                            <Select.Item label="Female" value="female" />
                                        </Select>
                                        <FormControl.ErrorMessage>{errors.gender}</FormControl.ErrorMessage>
                                    </FormControl>

                                </VStack>
                                <CButton onPress={() => {
                                    setIsValidateOnChange(true)
                                    validateForm().then(() => { handleSubmit() })
                                }}>
                                    Sign in
                                </CButton>
                            </VStack>

                        )}
                    </Formik>


                </VStack>
            </ScrollView>
        </Box >
    );
};
