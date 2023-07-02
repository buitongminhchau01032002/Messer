import { HStack, View, useTheme, Image, Button } from "native-base";
import { RootNavigatekey } from "navigation/navigationKey";
import React, { useEffect, useState } from "react";
import { RootStackScreenProps } from "types";
import * as ImagePicker from 'expo-image-picker';
import { ImageIcon, PhoneIcon, VideoIcon } from "components/Icons/Light";
import colors from "native-base/lib/typescript/theme/base/colors";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Timestamp, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAppSelector } from "hooks/index";

export type Storys = {
    id?: string,
    imageUrl: string,
    createdAt: Timestamp,
    seenUser: [],
    likedUser: []
}

export const NewStoryScreen = (props: RootStackScreenProps<RootNavigatekey.NewStory>) => {
    // const currentUser = auth.currentUser?.uid!
    const currentUser = useAppSelector((state) => state.auth.user);

    const { navigation, route } = props;
    const [imageUrl, setImageUrl] = useState('')
    const { colors } = useTheme()
    const [isLoading, setLoading] = useState(false)


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HStack space={4}>
                    <TouchableOpacity onPress={(() => pickImage())}>
                        <ImageIcon color="primary.900" size="md" />
                    </TouchableOpacity>
                </HStack>
            ),
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [navigation]);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };
    const handleSubmit = async () => {
        if (!imageUrl) return

        setLoading(true)
        const imgResponse = await fetch(imageUrl)
        const blob = await imgResponse.blob()
        const name = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
        const storageRef = ref(storage, "images/".concat(name));

        await uploadBytes(storageRef, blob).then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
                const newStory = {
                    imageUrl: url,
                    createdAt: serverTimestamp(),
                    seenUser: [],
                    likedUser: [],
                    owner: currentUser
                }

                addDoc(collection(db, 'User', currentUser?.id??"", 'Story'), newStory).then(async values => {
                    console.log(values.id)
                })
            })
        });
        setLoading(false)
    }

    return (
        <View flex={1} alignItems={'center'} justifyContent={'center'}>

            {
                !imageUrl ?
                    <TouchableOpacity onPress={(() => pickImage())}>
                        <ImageIcon color="primary.900" size="64" />
                    </TouchableOpacity>
                    :
                    <Image
                        h="full"
                        w="full"
                        source={{
                            uri: imageUrl,
                        }}
                        alt=""
                    />
            }
            {isLoading ? <ActivityIndicator size={84} color={colors.primary[900]} style={{
                // height : "full",
                // width : "full",
                // height : '60px',
                position: 'absolute'

            }} /> : <></>}


            <Button color={'primary.900'} position={'absolute'} right={2} bottom={2} w={150} h={20} disabled={imageUrl ? false : true} onPress={() => handleSubmit()}>
                Share
            </Button>

        </View>
    )
}