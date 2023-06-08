import { initializeApp } from 'firebase/app';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, getFirestore } from 'firebase/firestore';
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";

// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: 'AIzaSyDvKaKvCacVSBONANqPjVA6cv7kNFwEq1k',
    authDomain: 'messer-4c81b.firebaseapp.com',
    projectId: 'messer-4c81b',
    storageBucket: 'messer-4c81b.appspot.com',
    messagingSenderId: '805121390882',
    appId: '1:805121390882:web:300a309b7c1a4a62b04d7b',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
//auth
const auth = getAuth(app);
//notification
// const messaging = getMessaging(app);

const storage = getStorage(app);

export const converter = <T>() => ({
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot, options: SnapshotOptions) => ({
        id: snap.id,
        ...snap.data(options),
    } as T),
});

export { db, auth, storage };
