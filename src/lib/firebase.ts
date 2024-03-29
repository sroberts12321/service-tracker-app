// Required for side-effects
import firebase from "firebase/compat/app";
import "firebase/firestore";
import type { Customer } from "$lib/customer";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { notifications } from '$lib/stores/notifications';
import { allCustomers, activeServices, allServices, customerAutoSelectOptions } from "./stores/customer-store";
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
    CollectionReference,
    writeBatch
} from "firebase/firestore";
import { 
    PUBLIC_apiKey, 
    PUBLIC_authDomain, 
    PUBLIC_projectId, 
    PUBLIC_storageBucket, 
    PUBLIC_messagingSenderId, 
    PUBLIC_appId, 
    PUBLIC_measurementId 
} from "$env/static/public";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: PUBLIC_apiKey,
  authDomain: PUBLIC_authDomain,
  projectId: PUBLIC_projectId,
  storageBucket: PUBLIC_storageBucket,
  messagingSenderId: PUBLIC_messagingSenderId,
  appId: PUBLIC_appId,
  measurementId: PUBLIC_measurementId 
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
    let customerSelectObject = {};
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
            documentId: '',
			lastName: value.lastName,
			firstName: value.firstName,
			nickname: value.nickname,
			phone: value.phone,
			email: value.email,
			balance: value.balance,
			notes: value.notes,
			searchTerms: value.searchTerms,
        }
       customerSelectObject = {
            label: `${value.lastName}, ${value.firstName}`,
            value: value.id,
            keywords: value.searchTerms
        }
    }

    try {
        const docRef = await addDoc(collectionRef, documentObject);
        if (key == 'customers') {
            documentObject = {...documentObject,
                id: docRef.id,
            }
            customerSelectObject = {
                ...customerSelectObject,
                value: docRef.id
            }
            allCustomers.update(customers => [...customers, documentObject])
            customerAutoSelectOptions.update(customers => [...customers, customerSelectObject])
        } else if (key == 'services') {
			activeServices.update(services => [...services, documentObject]);
			allServices.update(services => [...services, documentObject]);
        }
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

export const writeCustomerUpdate = async(customerId: string, lastName: string, firstName: string, phone: string, email: string, balance: number, notes: string, nickname: string, searchTerms: string): Promise<any | undefined> => {
    const customerRef = doc(db, 'customers', customerId);
    try {
        let writeObject = { id: customerId, lastName: lastName, firstName: firstName, phone: phone, email: email, balance: balance, notes: notes, nickname: nickname, searchTerms: searchTerms}
        writeObject.searchTerms = `${firstName} ${lastName} ${email} ${nickname}`;

        const querySnapshot = await setDoc(customerRef, { lastName: lastName, firstName: firstName, phone: phone, email: email, balance: balance, notes: notes, nickname: nickname }, { merge: true });
        let updatedUserData = {};
        allCustomers.update((customers) => {
            customers.forEach((customer: Customer) => {
                if (customer.id == customerId) {
                    updatedUserData = {...customer, ...writeObject};
                }
            }) 
            return [...(customers.filter((customerObj) => customerObj.id !== customerId)), updatedUserData];
        }
        )
        return querySnapshot;
    } catch (e) {
        console.error("Error updating customer: ", e);
        notifications.danger('Error updating customer', 3000);
    }
}

export const deleteService = async(serviceId: string): Promise<any | undefined> => {
    const serviceRef = doc(db, 'services', serviceId);
    try {
        const querySnapshot = await deleteDoc(serviceRef);
        notifications.success("Service Deleted", 2000);
        return querySnapshot;
    } catch (e) {
        console.error("Error deleting service: ", e);
        notifications.danger('Error deleting service', 3000);
    }
}

export const deleteCustomer = async(customerId: string): Promise<any | undefined> => {
    const customerRef = doc(db, 'customers', customerId);
    try {
        const querySnapshot = await deleteDoc(customerRef);
        const batch = writeBatch(db);
        const q = query(servicesCollectionRef, where('customerId', '==', customerRef))
        const serviceQuerySnapshot = await getDocs(q);
        serviceQuerySnapshot.docs.forEach(document => batch.delete(document.ref))
        await batch.commit();
        notifications.success("Customer Deleted", 2000);
        return querySnapshot;
    } catch (e) {
        console.error("Error deleting customer: ", e);
        notifications.danger('Error deleting customer', 3000);
    }
}
