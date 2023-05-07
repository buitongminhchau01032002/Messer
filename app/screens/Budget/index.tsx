
import { Box, Button, Divider, Flex, HStack, Icon, Image, List, ScrollView, Spacer, Text, View } from "native-base";
import { AppBar } from "components/AppBar";
import React, { useEffect, useState } from 'react';
import { APP_PADDING } from "app/constants/Layout";
import { AppTabsStackScreenProps } from 'types';
import { AppTabsNavigationKey } from 'navigation/navigationKey';
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';
import { TabItem } from "./components/TabItem";
import Vi from "i18n/translations/vi";
import { ProgessBar } from "./components/ProgessBar";
import { TouchableOpacity } from "react-native-gesture-handler";

type Budget = {
    imgUrl: string,
    title: string,
    budget: Number,
    used: Number
}



export const BudgetScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.Budget>) => {
    const [tabs, setTab] = useState([
        { title: '12/2022', value: true },
        { title: '1/2023', value: false },
        { title: '2/2023', value: false },
        { title: 'LAST MONTH', value: false },
        { title: 'THIS MONTH', value: false },
    ]);

    const budget = [
        { imgUrl: '' }
    ]

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HStack
                    space={2}
                >
                    <Icon as={<FontAwesome name="search" />} size={6} />
                    <FontAwesome5 name="wallet" size={24} />
                </HStack>
            ),
        });
    }, [props.navigation]);

    return (
        <Box h="full">
            {/* <AppBar
                title="Budget"
                bg="primary.900"
                onPressDefaultLeftButton={() => props.navigation.openDrawer()}
                rightIcon={
                    <View
                        flexDirection={'row'}
                    >
                        <Icon as={<FontAwesome name="search" />} size={6} color="white" />
                        <Spacer width="4"></Spacer>
                        <FontAwesome5 name="wallet" size={24} color="white" />
                    </View>
                }
            /> */}
            <View p={APP_PADDING} w="full" flex={1} flexDirection={'column'}>
                <ScrollView>

                    <ScrollView horizontal={true} marginBottom={4}>
                        {tabs.map((tab) =>
                            <TabItem key={tab.title} title={tab.title} isActive={tab.value} onPress={() => {
                                setTab(tabs.map((tabb) => {
                                    if (tabb == tab) { return { title: tabb.title, value: true } }
                                    else return { title: tabb.title, value: false }

                                }))
                            }}></TabItem>
                        )}
                    </ScrollView>

                    <View backgroundColor={'gray.200'} padding={4} borderRadius={16} >

                        <View flexDirection={'row'} justifyContent={'space-between'} >
                            <Text fontSize='lg' fontWeight={'bold'} marginBottom={1}>Total budget</Text>
                            <Text fontSize='lg' bold={true}>28,282</Text>
                        </View>

                        <Text fontSize='md' color='gray.500'>1 budget</Text>

                        <Divider marginY={2} paddingY={0.25}></Divider>

                        <View flexDirection={'row'} shadow={1} marginBottom={1} justifyContent={'space-between'}>
                            <Text fontSize='md'>Spent</Text>
                            <Text fontSize='md' color={'red.500'}>28,282</Text>
                        </View>

                        <View flexDirection={'row'} justifyContent={'space-between'}>
                            <Text fontSize='md'>Remain</Text>
                            <Text fontSize='md' color={'blue.500'}>28,282</Text>
                        </View>
                    </View>

                    <Spacer height='10'></Spacer>

                    <View flexDirection={'row'} justifyContent={'space-between'} alignItems='center'>
                        <Text fontSize='lg' marginBottom={1}>Total budget</Text>
                        <View flexDirection={'row'} alignItems='center'>
                            <Text fontSize={'lg'} marginRight={2} color={'green.500'}>New group</Text>
                            <Icon as={<FontAwesome name="plus-circle" />} size={6} color='green.500' />
                        </View>
                    </View>

                    <View flexDirection={'row'} paddingTop={2} paddingBottom={10}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <Text fontSize='lg' fontWeight={'bold'}>28,282</Text>
                            </View>
                            <Text fontSize='md' color={'gray.400'} alignSelf={'flex-end'}>28,282</Text>
                            <ProgessBar value={80}></ProgessBar>

                        </Box>

                    </View>
                    <Divider></Divider>


                    <View flexDirection={'row'} paddingTop={2}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2} paddingBottom={10}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <Text fontSize='lg' fontWeight={'bold'}>28,282</Text>
                            </View>
                            <Text fontSize='md' color={'gray.400'} alignSelf={'flex-end'}>28,282</Text>
                            <ProgessBar value={80}></ProgessBar>
                        </Box>


                    </View>
                    <Divider></Divider>

                    <View flexDirection={'row'} paddingY={2}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <TouchableOpacity style={
                                    {
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderColor: 'gray'
                                    }
                                }><Text fontSize='lg'>Add</Text></TouchableOpacity>
                            </View>

                        </Box>

                    </View>
                    <Divider></Divider>
                    <View flexDirection={'row'} paddingY={2}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <TouchableOpacity style={
                                    {
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderColor: 'gray'
                                    }
                                }><Text fontSize='lg'>Add</Text></TouchableOpacity>
                            </View>

                        </Box>

                    </View>
                    <Divider></Divider>
                    <View flexDirection={'row'} paddingY={2}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <TouchableOpacity style={
                                    {
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderColor: 'gray'
                                    }
                                }><Text fontSize='lg'>Add</Text></TouchableOpacity>
                            </View>

                        </Box>

                    </View>
                    <Divider></Divider>
                    <View flexDirection={'row'} paddingY={2}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <TouchableOpacity style={
                                    {
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderColor: 'gray'
                                    }
                                }><Text fontSize='lg'>Add</Text></TouchableOpacity>
                            </View>

                        </Box>

                    </View>
                    <Divider></Divider>
                    <View flexDirection={'row'} paddingY={2}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <TouchableOpacity style={
                                    {
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderColor: 'gray'
                                    }
                                }><Text fontSize='lg'>Add</Text></TouchableOpacity>
                            </View>

                        </Box>

                    </View>
                    <Divider></Divider>
                    <View flexDirection={'row'} paddingY={2}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <TouchableOpacity style={
                                    {
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderColor: 'gray'
                                    }
                                }><Text fontSize='lg'>Add</Text></TouchableOpacity>
                            </View>

                        </Box>

                    </View>
                    <Divider></Divider>
                    <View flexDirection={'row'} paddingY={2}>
                        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={20} height={20} alt="description of image" borderRadius={50} size={10}></Image>

                        <Box flex={1} paddingX={2}>
                            <View flexDirection={'row'} justifyContent={'space-between'}>
                                <Text fontSize='lg'>Eat and drink</Text>
                                <TouchableOpacity style={
                                    {
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderColor: 'gray'
                                    }
                                }><Text fontSize='lg'>Add</Text></TouchableOpacity>
                            </View>

                        </Box>

                    </View>
                    <Divider></Divider>


                </ScrollView>

            </View >
        </Box >
    );
};
