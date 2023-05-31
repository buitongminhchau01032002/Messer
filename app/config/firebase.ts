import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyDvKaKvCacVSBONANqPjVA6cv7kNFwEq1k",
  authDomain: "messer-4c81b.firebaseapp.com",
  projectId: "messer-4c81b",
  storageBucket: "messer-4c81b.appspot.com",
  messagingSenderId: "805121390882",
  appId: "1:805121390882:web:300a309b7c1a4a62b04d7b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// if (window.location.hostname === "localhost") {
//   auth.useEmulator("http://localhost:9099");
//   db.useEmulator("localhost", "8080");
//   storage.useEmulator("localhost", "9199");
// }

export { db, auth, storage };
export default firebase;
