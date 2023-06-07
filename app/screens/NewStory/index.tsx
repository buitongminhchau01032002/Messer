import { HStack, View, useTheme, Image, Button } from "native-base";
import { RootNavigatekey } from "navigation/navigationKey";
import React, { useEffect, useState } from "react";
import { RootStackScreenProps } from "types";
import * as ImagePicker from 'expo-image-picker';
import { ImageIcon, PhoneIcon, VideoIcon } from "components/Icons/Light";
import colors from "native-base/lib/typescript/theme/base/colors";
import { TouchableOpacity } from "react-native";

export const NewStoryScreen = (props: RootStackScreenProps<RootNavigatekey.NewStory>) => {
    const { navigation, route } = props;
    const [imageUrl, setImageUrl] = useState('')
    const { colors } = useTheme()


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
            <Button color={'primary.900'} position={'absolute'} right={2} bottom={2} w={150} h={20}>
                Share
            </Button>

        </View>
    )
}