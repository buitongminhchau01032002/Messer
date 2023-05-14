import { APP_PADDING } from 'app/constants/Layout';
import { ScrollView, View, Text, HStack, useTheme, TextField, Input, Box } from 'native-base';
import { RootNavigatekey } from 'navigation/navigationKey';
import React from 'react';
import { useEffect } from 'react';
import { RootStackScreenProps } from 'types';

export const SearchScreen = (props: RootStackScreenProps<RootNavigatekey.Search>) => {
    const { navigation } = props;
    const { colors } = useTheme();
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Search',
            headerTransparent: false,
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [props.navigation]);

    return (
        <View backgroundColor={'white'} flex={1} pt={APP_PADDING}>
            <ScrollView flex={1}>
                <Input mx={8} placeholder="Input"/>
            </ScrollView>
        </View>
    );
};
