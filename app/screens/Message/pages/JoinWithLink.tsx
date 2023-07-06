import { APP_PADDING } from 'app/constants/Layout';
import { PhoneIcon } from 'components/Icons/Light';
import { SearchIcon } from 'components/Icons/Light/Search';
import { auth, db } from 'config/firebase';
import Dialog from 'react-native-dialog';

import {
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
} from 'firebase/firestore';

import {
    Text,
    View,
    Spinner,

} from 'native-base';
import { RootNavigatekey } from 'navigation/navigationKey';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { RootStackScreenProps } from 'types';
import { useAppState } from 'native-base/lib/typescript/core/color-mode/hooks';
import { useAppSelector } from 'hooks/index';
import * as Linking from 'expo-linking';
import { MultiRoom } from 'screens/Message/type';

export const JoinWithLinkScreen = (props: RootStackScreenProps<RootNavigatekey.JoinWithLink>) => {
    const { navigation, route } = props;
    const currentUser = useAppSelector((state) => state.auth.user);
    const { roomId } = route.params;
    const [nameDialogVisible, setNameDialogVisible] = useState(false);
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
                <></>
            ),

        });
    }, [props.navigation]);
    //check join by link
    // Linking.getInitialURL().then((url) => {
    //     console.log(url)
    //     setUrl(url||'')
    // }).catch((error) => {console.error(error.message)})

    // useEffect(() => {
    //     const getUrlAsync = async () => {
    //       // Get the deep link used to open the app
    //       const url = await Linking.getInitialURL();
    //       console.log(url);
    //        if(url) {
    //         // console.log(url + 'asdfasdfdasdasdf');
    //          const {queryParams} = Linking.parse(url)
    //          let IdRoom = queryParams?  queryParams.idJoin : '';

    //          if(typeof IdRoom === 'string') {
    //           //   const currentUser = useAppSelector((state) => state.auth.user);
    //           console.log(IdRoom);
    //              const roomRef = doc(db, 'MultiRoom', IdRoom);
    //              console.log(roomRef.id + 'ahihihihihi');
    //               updateDoc(roomRef, {
    //                  users: arrayUnion(currentUser?.id),
    //              }).then(() => {
    //                 // navigation.replace(RootNavigatekey.MultiRoomMessageDetail, { })
    //                 console.log('Join duoc roiiii na');
    //                 setIsLoading(false);
    //              }).catch((error)=>{
    //                  console.log("Api call error");
    //                  alert(error.message);
    //               });;
    //          }
    //      }

    //     };
    //     getUrlAsync();

    //   }, []);
    const _handleOpenURL = async (obj: any) => {
        // add your code here
        console.log(obj.url);
        const { queryParams } = Linking.parse(obj.url)
        console.log(queryParams);
        let IdRoom = queryParams ? queryParams.idJoin : '';
        if (typeof IdRoom === 'string') {
            //   const currentUser = useAppSelector((state) => state.auth.user);
            console.log(IdRoom);
            const roomRef = doc(db, 'MultiRoom', IdRoom);
            // console.log(roomRef.id + 'ahihihihihi');
            await updateDoc(roomRef, {
                users: arrayUnion(currentUser?.id),
            }).catch((error) => {
                console.log("Api call error");
                alert(error.message);
            });;
            console.log('Join duoc roiiii na');
            setIsLoading(false);

            let multiRoo;
            await getDoc(roomRef).then(snap => {
                multiRoom = {
                    id: snap.id,
                    lastMessages: snap.data()?.lastMessage,
                    reads: snap.data()?.reads,
                    users: snap.data()?.users
                }
            })
            navigation.replace(RootNavigatekey.MultiRoomMessageDetail, {
                type: "single",
                room: multiRoom,
            })
            // console.log(multiRoom)
            // console.log(roomRef)
        }
    }

    useEffect(() => {
        const componentDidMount = async () => {
            Linking.getInitialURL().then((ev) => {
                if (ev) {
                    _handleOpenURL({ url: ev });
                }
            }).catch(err => {
                console.log("Api call error");
                alert(err.message);
            });
            Linking.addEventListener('url', _handleOpenURL);
        }
        componentDidMount();
    }, []);


    return (
        <View backgroundColor={'white'} flex={1} p={8} pt={0} justifyContent={"center"} alignItems={"center"}>
            {
                isLoading ? <Spinner size="lg" color="primary.900" on /> : <Text>Join duoc roi na!!!</Text>
            }

        </View>
    );
};

