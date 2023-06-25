import { initializeApp } from 'firebase/app';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const firebaseConfig = {
    apiKey: 'AIzaSyDHmCDS2fepWQWLlb2rGC0sg1vNd5gnozo',
    authDomain: 'messer2.firebaseapp.com',
    projectId: 'messer2',
    storageBucket: 'messer2.appspot.com',
    messagingSenderId: '747833304805',
    appId: '1:747833304805:web:67e51dee01f7b465f2560c',
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
    fromFirestore: (snap: QueryDocumentSnapshot, options: SnapshotOptions) =>
        ({
            id: snap.id,
            ...snap.data(options),
        } as T),
});

export { db, auth, storage };
