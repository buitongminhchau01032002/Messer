import { AppBar } from "components/AppBar";
import { Button, Center, Flex, Stack, View, Text, HStack, Icon, Spacer, Image, ScrollView } from "native-base";
import { AppTabsNavigationKey, RootNavigatekey } from "navigation/navigationKey";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppTabsStackScreenProps } from "types";
import { MessageItem } from "./components/MessageItem";
import { EvilIcons, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Animated, TouchableHighlight, StyleSheet, TouchableOpacity } from "react-native";

let init = [
  { id: "1", name: "Person 1", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "2", name: "Person 2", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "3", name: "Person 3", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "4", name: "Person 4", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "5", name: "Person 5", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "6", name: "Person 6", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "7", name: "Person 6", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "8", name: "Person 6", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "9", name: "Person 6", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
  { id: "10", name: "Person 6", mess: "asdkjahsdjkakjdljkashlkashfa", isOpened: false },
]

export const MessageScreen = (
  props: AppTabsStackScreenProps<AppTabsNavigationKey.Message>
) => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isCollapsedRef = useRef(false)
  const users = [
    { id: "1", name: "Person 1", url: "" },
    { id: "2", name: "Person 2", url: "" },
    { id: "3", name: "Person 3", url: "" },
    { id: "4", name: "Person 4", url: "" },
    { id: "5", name: "Person 5", url: "" },
    { id: "6", name: "Person 6", url: "" },
    { id: "7", name: "Person 7", url: "" },
  ]

  const [messes, setMesses] = useState(init)

  const [isOpen, setIsOpen] = useState([])



  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    if (positionY > 30 && !isCollapsedRef.current) {
      isCollapsedRef.current = true
      props.navigation.setOptions({
        headerTitle: "Channels",
        headerTitleStyle: { color: 'blue.900' }
      })

      console.log(isCollapsedRef.current)
    }
    if (positionY <= 0 && isCollapsedRef.current) {
      isCollapsedRef.current = false
      props.navigation.setOptions({
        headerTitle: "",
        headerTitleStyle: { color: 'blue.900' }
      })

      console.log(isCollapsedRef)
    }
    console.log(positionY)
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <HStack marginLeft={6}>
          <Ionicons name="notifications" size={24} color="black" />
        </HStack>

      ),

      headerRight: () => (
        <HStack
          marginRight={6}
          space={6}
        >
          <EvilIcons name="search" size={36} color="black" />
          <Ionicons name="add-outline" size={36} color="black" />


        </HStack>
      ),
    });
  }, [props.navigation]);

  return (

    <View backgroundColor={"white"}>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <View w={'full'}
          height={200}
          backgroundColor={'blue.500'}
          position={'absolute'}
        ></View>

        <View width={'full'} padding={4}>
          <View height={"64px"}></View>
          <Text color={'white'} fontSize={'36'} fontWeight={'bold'}>Channels</Text>
          <View height={10} />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
            {users.map((user) =>
              <View borderRadius={"20"} width={"92px"} height={"141.6px"} marginX={2}>
                <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} width={"100%"} height={"100%"} alt="description of image" borderRadius={20} ></Image>
                <View size={"100%"} position={'absolute'}>
                  <HStack w={'100%'} justifyContent={'flex-end'}>
                    <View size={4} borderRadius={50} backgroundColor={"green.500"} margin={2} />
                  </HStack>
                  <Text marginTop={"16"} color={"white"} alignSelf={'center'} fontWeight={"bold"}>{user.name}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <Text marginTop={10} fontWeight={'bold'}>Recent contact</Text>
        </View>

        {
          messes.map((mess) =>
            !mess.isOpened ?
              <TouchableHighlight
                style={styles.rowFrontVisible}
                onPress={() => {
                  const newMesses = messes.map((hm) => {
                    if (hm.id == mess.id) {
                      return {
                        ...hm,
                        isOpened: true,
                      }
                    } else {
                      return hm
                    }
                  },

                  )
                  setMesses(newMesses)
                }}
                underlayColor={'#aaa'}>
                <View flexDirection={'row'}>
                  <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} size={10} alt="description of image" borderRadius={20} ></Image>
                  <View>
                    <Text>{mess.name}</Text>
                    <Text>{mess.mess}</Text>
                  </View>
                  <View flex={1}></View>
                  <View>
                    <Entypo name="dots-three-horizontal" size={24} color="black" />
                    <Text>12m</Text>
                  </View>
                </View>
              </TouchableHighlight>
              :

              <View flexDirection={'row'}>
                <TouchableHighlight
                  style={styles.rowFrontVisibleOpened}
                  onPress={() => { mess.isOpened = !mess.isOpened }}
                  underlayColor={'#aaa'}>
                  <View flexDirection={'row'}>
                    <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} size={10} alt="description of image" borderRadius={20} ></Image>
                    <View>
                      <Text>{mess.name}</Text>
                      <Text>{mess.mess}</Text>
                    </View>
                    <View flex={1}></View>
                    <View>
                      <Entypo name="dots-three-horizontal" size={24} color="black" />
                      <Text>12m</Text>
                    </View>
                  </View>
                </TouchableHighlight>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backRightBtnRight]}
                  onPress={() => { }}
                >
                  <Animated.View
                    style={[
                      styles.trash,
                    ]}>
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={25}
                      color="#fff"
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
          )
        }

      </ScrollView >
    </View >


  );

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    // shadowColor: '#999',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowFrontVisibleOpened: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
    marginLeft: -10,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
});


