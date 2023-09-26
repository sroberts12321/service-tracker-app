// Required for side-effects
import firebase from "firebase/compat/app";
import "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDdHjvhFsSfIDgWjgAJVDgAjPhdT7epvY",
  authDomain: "service-tracker-app-2c492.firebaseapp.com",
  projectId: "service-tracker-app-2c492",
  storageBucket: "service-tracker-app-2c492.appspot.com",
  messagingSenderId: "16749129106",
  appId: "1:16749129106:web:57c2b46184feca5d62254b",
  measurementId: "G-G3XNH997J2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export const writeStore = async (key: string, value: any) => {
    try {
        const docRef = await addDoc(collection(db, key), {
            lastName: value.lastName,
            firstName: value.firstName,
            phone: value.phone,
            email: value.email,
            balance: value.balance
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const readStore = async (key: string): Promise<any | undefined> => {
    const querySnapshot = await getDocs(collection(db, key));
    return querySnapshot;
}
