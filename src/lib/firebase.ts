// Required for side-effects
import firebase from "firebase/compat/app";
import "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { notifications } from '$lib/stores/notifications';
import { 
    Firestore, 
    getFirestore, 
    collection, 
    addDoc, 
    deleteDoc,
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

    let successMsg: String = "";
    let documentObject = {};
    if (key == 'services') {
        successMsg = "Service Successfully Saved";
        collectionRef = servicesCollectionRef;
        const customerRef = doc(db, 'customers', value.customerId);
        documentObject = {
            customerId: customerRef,
            dropOffDate: value.dropOffDate,
            paid: value.paid,
            pickUpDate: value.pickUpDate,
            pickedUp: value.pickedUp,
            referenceNum: value.referenceNum,
            typeOfService: value.typeOfService,
            notes: value.notes
        }
    } else if (key == 'customers') {
        successMsg = "Customer Successfully Saved";
        collectionRef = customerCollectionRef;
        documentObject = {
			id: value.id,
			lastName: value.lastName,
			firstName: value.firstName,
			nickname: value.nickname,
			phone: value.phone,
			email: value.email,
			balance: value.balance,
			notes: value.notes,
			searchTerms: value.searchTerms,
        }
    }

    try {
        const docRef = await addDoc(collectionRef, documentObject);
        notifications.success(successMsg, 2000);
    } catch (e) {
        console.error("Error adding document: ", e);
        notifications.danger('Error adding customer', 3000);
    }
}

export const readStore = async (key: string): Promise<any | undefined> => {
    try {
        const q = query(collection(db, key), orderBy("lastName"));
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    } catch (e) {
        console.error("Error reading database: ", e);
        notifications.danger('Error pulling data', 3000);
    }
}

export const readCustomerDetail = async(key: string): Promise<any | undefined> => {
    const customerRef = doc(db, 'customers', key);
    const q = query(servicesCollectionRef, where('customerId', '==', customerRef))
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    } catch (e) {
        console.error("Error reading database: ", e);
        notifications.danger('Error reading database', 3000);
    }
}

export const writeServiceUpdate = async(serviceId: string, paid: boolean, pickedUp: boolean, pickUpDate: string): Promise<any | undefined> => {
    const serviceRef = doc(db, 'services', serviceId);
    try {
        const querySnapshot = await setDoc(serviceRef, { paid: paid, pickedUp: pickedUp, pickUpDate: pickUpDate }, { merge: true });
        return querySnapshot;
    } catch (e) {
        console.error("Error updating database: ", e);
        notifications.danger('Error updating database', 3000);
    }
}

export const writeCustomerUpdate = async(customerId: string, lastName: string, firstName: string, phone: string, email: string, balance: number, notes: string, nickname: string): Promise<any | undefined> => {
    const customerRef = doc(db, 'customers', customerId);
    try {
        const querySnapshot = await setDoc(customerRef, { lastName: lastName, firstName: firstName, phone: phone, email: email, balance: balance, notes: notes, nickname: nickname }, { merge: true });
        return querySnapshot;
    } catch (e) {
        console.error("Error updating customer: ", e);
        notifications.danger('Error updating customer', 3000);
    }
    
}

export const deleteCustomer = async(customerId: string): Promise<any | undefined> => {
    const customerRef = doc(db, 'customers', customerId);
    try {
        const querySnapshot = await deleteDoc(customerRef);
        notifications.success("Customer Deleted", 2000);
        return querySnapshot;
    } catch (e) {
        console.error("Error deleting customer: ", e);
        notifications.danger('Error deleting customer', 3000);
    }
    
}