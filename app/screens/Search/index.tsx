import { APP_PADDING } from 'app/constants/Layout';
import { SearchIcon } from 'components/Icons/Light/Search';
import { ScrollView, View, Text, HStack, useTheme, TextField, Input, Box, VStack, Image, Divider } from 'native-base';
import { RootNavigatekey } from 'navigation/navigationKey';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackScreenProps } from 'types';

const userList = [
    {
        name: 'Thang abc dgac ',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
        name: 'Thang',
        avt: 'https://images.unsplash.com/photo-1682687220801-eef408f95d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
];

export const SearchScreen = (props: RootStackScreenProps<RootNavigatekey.Search>) => {
    const { navigation } = props;
    const { colors } = useTheme();
    const [isInputFocused, setInputFocused] = useState(false);
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Search',
            headerTransparent: false,
            headerTintColor: colors.primary[900],
            headerTitleStyle: { color: colors.blue[900] },
        });
    }, [props.navigation]);

    const ListItem = (item: { name: string; avt: string; onPress?: () => void }) => (
        <TouchableOpacity onPress={() => {}}>
            <View>
                <HStack space={6} alignItems={'center'} my = {2}>
                    <Image
                        alt="..."
                        source={{ uri: item.avt }}
                        size={16}
                        borderRadius={100}
                    ></Image>
                    <Text bold fontSize="md">
                        {item.name}
                    </Text>
                </HStack>
                {/* <Divider/> */}
            </View>
        </TouchableOpacity>
        
    );

    return (
        <View backgroundColor={'white'} flex={1} p={8}>
            <ScrollView flex={1}>
                <Text fontWeight={'bold'}>Enter a name</Text>
                <View
                    flex={1}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="#fff"
                    borderBottomWidth={1}
                    borderColor={isInputFocused ? 'red.900' : 'black'}
                >
                    <Input
                        flex={1}
                        placeholder="Input"
                        borderWidth={0}
                        borderRadius={0}
                        color={'blue.900'}
                        mt="2"
                        backgroundColor={'white'}
                    />
                    <SearchIcon size={'sm'} color={'red.500'} />
                </View>
                <Text fontWeight={'bold'} marginY={8}>
                    Channel
                </Text>
                <VStack space={4}>
                    {userList.map((item, idx) => (
                        <ListItem
                            {...item}
                            key={idx}
                            onPress={() => navigation.navigate(RootNavigatekey.MessageDetail)}
                        />
                        
                    ))}
                </VStack>
            </ScrollView>
        </View>
    );
};
