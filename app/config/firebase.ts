import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from "firebase/messaging";

// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

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

export { db, auth };
