import { initializeApp } from 'firebase/app';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const firebaseConfig = {
    apiKey: 'AIzaSyDvKaKvCacVSBONANqPjVA6cv7kNFwEq1k',
    authDomain: 'messer-4c81b.firebaseapp.com',
    projectId: 'messer-4c81b',
    storageBucket: 'messer-4c81b.appspot.com',
    messagingSenderId: '805121390882',
    appId: '1:805121390882:web:300a309b7c1a4a62b04d7b',
};

//another firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyBJh3l-EnxnfnaDK6U2LlUnPt2GUc1cxCg",
//     authDomain: "anothermesser.firebaseapp.com",
//     projectId: "anothermesser",
//     storageBucket: "anothermesser.appspot.com",
//     messagingSenderId: "1085961047153",
//     appId: "1:1085961047153:web:d4970773d35efbc091dfd0"
//   };

    // apiKey: 'AIzaSyDHmCDS2fepWQWLlb2rGC0sg1vNd5gnozo',
    // authDomain: 'messer2.firebaseapp.com',
    // projectId: 'messer2',
    // storageBucket: 'messer2.appspot.com',
    // messagingSenderId: '747833304805',
    // appId: '1:747833304805:web:67e51dee01f7b465f2560c',
// };
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
    fromFirestore: (snap: QueryDocumentSnapshot, options: SnapshotOptions) =>
        ({
            id: snap.id,
            ...snap.data(options),
        } as T),
});

export { db, auth, storage };
