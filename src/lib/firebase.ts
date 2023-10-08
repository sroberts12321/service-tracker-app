// Required for side-effects
import firebase from "firebase/compat/app";
import "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    Firestore, 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    getDoc, 
    setDoc,
    doc, 
    query, 
    where, 
    orderBy,
    CollectionReference 
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

const customerCollectionRef = collection(db, 'customers');
const servicesCollectionRef = collection(db, 'services');

let collectionRef: CollectionReference;

export const writeStore = async (key: string, value: any) => {

    let documentObject = {};
    if (key == 'services') {
        collectionRef = servicesCollectionRef;
        const customerRef = doc(db, 'customers', value.customerId);
        documentObject = {
            customerId: customerRef,
            dropOffDate: value.dropOffDate,
            paid: value.paid,
            pickUpDate: value.pickUpDate,
            pickedUp: value.pickedUp,
            referenceNum: value.referenceNum,
            typeOfService: value.typeOfService
        }
    } else if (key == 'customers') {
        collectionRef = customerCollectionRef;
        documentObject = {
            lastName: value.lastName,
            firstName: value.firstName,
            phone: value.phone,
            email: value.email,
            balance: value.balance
        }
    }

    try {
        const docRef = await addDoc(collectionRef, documentObject);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const readStore = async (key: string): Promise<any | undefined> => {
    const querySnapshot = await getDocs(collection(db, key));
    return querySnapshot;
}

export const readCustomerDetail = async(key: string): Promise<any | undefined> => {
    const customerRef = doc(db, 'customers', key);
    const q = query(servicesCollectionRef, where('customerId', '==', customerRef))
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

export const writeServiceUpdate = async(serviceId: string, paid: boolean, pickedUp: boolean, pickUpDate: string): Promise<any | undefined> =>{
    const serviceRef = doc(db, 'services', serviceId);
    const querySnapshot = await setDoc(serviceRef, { paid: paid, pickedUp: pickedUp, pickUpDate: pickUpDate }, { merge: true });
    return querySnapshot;
}