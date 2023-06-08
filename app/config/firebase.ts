import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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


//init services

const auth = getAuth();


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


export {
    db,
    auth,
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
};
