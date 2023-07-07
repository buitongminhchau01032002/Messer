import { RootNavigatekey } from 'navigation/navigationKey';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackScreenProps } from 'types';
import { FontAwesome } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useAppSelector } from 'hooks/index';
import { addDoc, and, collection, getDocs, or, query, where } from 'firebase/firestore';
import { db } from 'config/firebase';

export const QRScanScreen = (props: RootStackScreenProps<RootNavigatekey.QRScan>) => {
    const { navigation } = props;
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const currentUser = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        const q = query(
            collection(db, 'SingleRoom'),
            or(
                and(where('user1', '==', currentUser?.id), where('user2', '==', data)),
                and(where('user2', '==', currentUser?.id), where('user1', '==', data)),
            ),
        );

        const messes = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            messes.push({
                id: doc.id,
                type: 'single',
                ...data,
            });
        });

        if (messes.length != 0) {
            navigation.replace(RootNavigatekey.MessageDetail, { type: 'single', room: messes[0] });
        } else {
            const newRoomData = {
                user1: currentUser?.id,
                user2: data,
            };
            const newRoom = await addDoc(collection(db, 'SingleRoom'), newRoomData);

            const roomData = {
                id: newRoom.id,
                ...newRoomData,
                type: 'single',
            };
            // console.log(roomData);
            navigation.navigate(RootNavigatekey.MessageDetail, { type: 'single', room: roomData });
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {/* {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}
        </View>
    );
};
