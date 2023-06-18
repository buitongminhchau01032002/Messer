import { current } from "@reduxjs/toolkit"
import { APP_PADDING } from "app/constants/Layout";
import { EllipsisIcon, ImageIcon, MicIcon, NavigationIcon, PlusIcon } from "components/Icons/Light";
import { Box, ScrollView, View, Image, Text, Input, SearchIcon, CloseIcon, HStack, VStack, Spacer, useTheme } from "native-base"
import { TouchableOpacity } from 'components/TouchableOpacity';
import { AppTabsNavigationKey, RootNavigatekey, } from "navigation/navigationKey"
import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, Dimensions, Animated, } from 'react-native';
import { AppTabsStackScreenProps, RootStackScreenProps } from "types"
import { FontAwesome } from "@expo/vector-icons";
import * as Progress from 'react-native-progress';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const haiz = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5]




export const StoryScreen = (props: RootStackScreenProps<RootNavigatekey.Story>) => {

    return <View><Text>hihi</Text></View>
    // const { colors } = useTheme();
    // const [currentX, setCurrentX] = useState(0)
    // const [scrollable, setScrollable] = useState(true)
    // const scrollViewRef = useRef();
    // const progess = useRef(new Animated.Value(0)).current;

    // // const widthProgress = useRef(new Animated.Value()).current;

    // // const [progress, setProgess] = useState(0)

    // const progressAnim = progess.interpolate({
    //     inputRange: [0, 100],
    //     outputRange: ["0%", "100%"],
    // });


    // function handleScroll(event: Object): void {
    //     console.log("adsa")
    //     setCurrentX(event.nativeEvent.contentOffset.x)
    // }

    // const startScroll = () => {
    //     console.log("asd")
    //     progess.setValue(0)
    //     Animated.timing(progess, {
    //         toValue: screenWidth,
    //         duration: 5000,
    //         useNativeDriver: false
    //     }).start();
    // };
    // const stopScroll = () => {
    //     // Will change fadeAnim value to 1 in 5 seconds

    //     Animated.timing(
    //         progess
    //     ).stop();
    // };

    // useEffect(() => {
    //     startScroll()
    // }, [])






    // useEffect(() => {
    //     props.navigation.setOptions({
    //         headerLeft: () => (<></>),
    //     });
    // }, [props.navigation])
    // useEffect(() => {
    //     const intervalId = setInterval(async () => {
    //         if (scrollable) {
    //             // startScroll()

    //             scrollViewRef.current.scrollTo({ x: currentX + screenWidth, y: 0, animated: true })
    //         }

    //         console.log(scrollable)

    //     }, 5000)

    //     return () => clearInterval(intervalId);

    // }, [ scrollable])



    // return (
    //     <View backgroundColor={'white'} flex={1}  >

    //         <ScrollView scrollEnabled={scrollable} flex={1} pagingEnabled horizontal={true} ref={scrollViewRef} onScroll={e => { setCurrentX(1.5) }} scrollEventThrottle={100}>
    //             {haiz.map((item, idx) => (
    //                 <Box w={screenWidth} >

    //                     <Image
    //                         position="absolute" top="0" left="0" right="0" bottom="0"
    //                         h="full"
    //                         w="full"
    //                         source={{
    //                             uri: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    //                         }}
    //                         alt=""
    //                     />


    //                     <Box px="7" pt="16" flexDirection={'row'}>
    //                         <HStack space={2} alignItems={'center'} flex={1}>
    //                             <Image
    //                                 alt="..."
    //                                 source={{
    //                                     uri: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    //                                 }}
    //                                 style={{ width: 40, height: 40 }}
    //                                 borderRadius={100}
    //                             ></Image>
    //                             <Text bold color={'white'} fontSize={18}>An Bùi nè {idx}</Text>

    //                             <Text fontSize={14} color={'white'} pt={1}>2 minutes ago</Text>
    //                             <Spacer flex={1}></Spacer>
    //                             <TouchableOpacity onPress={() => { }}>
    //                                 <CloseIcon size="md" color="white" />
    //                             </TouchableOpacity>
    //                         </HStack>
    //                     </Box>
    //                     <HStack position="absolute" bottom={0} px={APP_PADDING} space={4} alignItems="flex-end">
    //                         <Input
    //                             // value={content}
    //                             // onChangeText={(text) => setContent(text)}
    //                             flex={1}
    //                             placeholder="Message"
    //                             fontSize="md"
    //                             bg="gray.500"
    //                             borderWidth={0}
    //                             borderRadius={20}
    //                             multiline
    //                             onFocus={() => {
    //                                 setScrollable(false)
    //                                 // scrollRef.current?.scrollToEnd({ animated: true })
    //                             }
    //                             }
    //                             backgroundColor="gray.100"
    //                         />
    //                         <TouchableOpacity px={2} py={3}
    //                             // disabled={isSending} 
    //                             onPress={() => {
    //                                 setScrollable(false)
    //                                 // handleSendMessage(content)
    //                             }
    //                             }
    //                         >
    //                             <NavigationIcon color="primary.900" size="md" />
    //                             {/* {isSending ? <ActivityIndicator color={colors.primary[900]} /> : <NavigationIcon color="primary.900" size="md" />} */}
    //                         </TouchableOpacity>

    //                         <TouchableOpacity px={2} py={3} onPress={() => { stopScroll() }}>
    //                             <FontAwesome name="heart-o" size={24} color={colors.primary[900]} />
    //                         </TouchableOpacity>
    //                         <TouchableOpacity px={2} py={3} onPress={() => {

    //                             startScroll()
    //                         }
    //                         }>
    //                             <FontAwesome name="heart" size={24} color={colors.primary[900]} />
    //                         </TouchableOpacity>
    //                     </HStack>
    //                 </Box>
    //             ))}
    //             {/* <Box px="7" pt="36" position={'absolute'} width={screenWidth} > */}

    //             {/* <Progress.Bar progress={0.5} width={null} /> */}




    //             {/* </Box> */}



    //         </ScrollView>
    //         <Animated.View style={{
    //             backgroundColor: 'white',
    //             width: progess,
    //             position: 'absolute',
    //             // marginHorizontal: 16,
    //             marginTop: 36,
    //             height: 10
    //         }} />

    //     </View>

    // );




}