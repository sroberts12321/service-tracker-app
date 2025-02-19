// Required for side-effects
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import type { Customer } from '$lib/customer';
import type { Service } from '$lib/service';

import {
	type UserCredential,
	type User,
	type Auth,
	type AuthCredential,
	setPersistence,
	initializeAuth,
	browserLocalPersistence,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	reauthenticateWithCredential,
	onAuthStateChanged,
	signOut
} from 'firebase/auth';
import { initializeApp, FirebaseError } from 'firebase/app';
import { goto } from '$app/navigation';
import { notifications } from '$lib/stores/notifications';
import { allCustomers, activeServices, allServices } from './stores/customer-store';
import {
	getFirestore,
	collection,
	addDoc,
	deleteDoc,
	getDocs,
	setDoc,
	doc,
	query,
	where,
	orderBy,
	CollectionReference,
	writeBatch
} from 'firebase/firestore';
import {
	PUBLIC_apiKey,
	PUBLIC_authDomain,
	PUBLIC_projectId,
	PUBLIC_storageBucket,
	PUBLIC_messagingSenderId,
	PUBLIC_appId,
	PUBLIC_measurementId
} from '$env/static/public';
import { writable } from 'svelte/store';

// Firebase Config for Web App
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
const auth = initializeAuth(app, {
	persistence: browserLocalPersistence
});
const db = getFirestore(app);

type userStore = {
	uid: string;
	email: string | null;
	displayName: string | null;
	isAuthenticated: boolean | null;
};

function createUserStore() {
	const { subscribe, set } = writable<userStore | null>(null);

	onAuthStateChanged(auth, (userData) => {
		if (userData) {
			const userStore: userStore = {
				uid: userData.uid,
				email: userData.email,
				displayName: userData.displayName,
				isAuthenticated: true
			};
			set(userStore);
		} else {
			set(null);
		}
	});
	return {
		subscribe,
		set
	};
}

export const user = createUserStore();

function handleUserCredential(userCredential: UserCredential) {
	if (userCredential) {
		const userStore: userStore = {
			uid: userCredential.user.uid,
			email: userCredential.user.email,
			displayName: userCredential.user.displayName,
			isAuthenticated: true
		};
		user.set(userStore);
		auth.updateCurrentUser(userCredential.user);
		goto('/');
	} else {
		user.set(null);
		goto('/login');
	}
}

function handleUserCredentialError(error: unknown) {
	if (error instanceof FirebaseError) {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log(`errorCode: ${errorCode}`);
		console.log(`errorCode: ${errorMessage}`);
		notifications.danger(errorMessage, 5000);
	}
}

export function createUser(email: string, password: string, authState: Auth = auth) {
	createUserWithEmailAndPassword(authState, email, password)
		.then((userCredential) => {
			handleUserCredential(userCredential);
		})
		.catch((error) => {
			handleUserCredentialError(error);
		});
}

export function loginUser(email: string, password: string, authState: Auth = auth) {
	signInWithEmailAndPassword(authState, email, password)
		.then((userCredential) => {
			handleUserCredential(userCredential);
		})
		.catch((error) => {
			handleUserCredentialError(error);
		});
}

export function reauthenticateUser(prevUser: User, credential: AuthCredential) {
	reauthenticateWithCredential(prevUser, credential)
		.then((userCredential) => {
			handleUserCredential(userCredential);
		})
		.catch((error) => {
			handleUserCredentialError(error);
		});
}

export function logoutUser(authState: Auth = auth) {
	signOut(authState)
		.then(() => {
			user.set(null);
			goto('/login');
		})
		.catch((error) => {
			handleUserCredentialError(error);
		});
}

export function checkAuth(authState: Auth = auth) {
	if (authState.currentUser != null) {
		console.log(`${authState.currentUser.toJSON}: current user auth`);
		return true;
	}
	console.log(authState.currentUser);
	return false;
}

await setPersistence(auth, browserLocalPersistence);

const customerCollectionRef = collection(db, 'customers');
const servicesCollectionRef = collection(db, 'services');

let collectionRef: CollectionReference;

export const writeStore = async (key: string, value: any) => {
	let successMsg: string = '';
	let documentObject = {};
	if (key == 'services') {
		successMsg = 'Service Successfully Saved';
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
		};
	} else if (key == 'customers') {
		let label = '';
		if (value.firstName.length > 0) {
			label = `${value.lastName}, ${value.firstName}`;
		} else {
			label = value.lastName;
		}
		successMsg = 'Customer Successfully Saved';
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
			label
		};
	}

	try {
		const docRef = await addDoc(collectionRef, documentObject);
		if (key == 'customers') {
			documentObject = { ...documentObject, id: docRef.id };
			allCustomers.update((customers) => [documentObject as Customer, ...customers]);
		} else if (key == 'services') {
			activeServices.update((services) => [documentObject as Service, ...services]);
			allServices.update((services) => [documentObject as Service, ...services]);
		}
		notifications.success(successMsg, 2000);
	} catch (e) {
		console.error('Error adding document: ', e);
		notifications.danger('Error adding customer', 3000);
	}
};

export const readStore = async (key: string): Promise<any | undefined> => {
	try {
		const q = query(collection(db, key), orderBy('lastName'));
		const querySnapshot = await getDocs(q);
		return querySnapshot;
	} catch (e) {
		console.error('Error reading database: ', e);
		notifications.danger('Error pulling data', 3000);
	}
};

export const readCustomerDetail = async (key: string): Promise<any | undefined> => {
	const customerRef = doc(db, 'customers', key);
	const q = query(servicesCollectionRef, where('customerId', '==', customerRef));
	try {
		const querySnapshot = await getDocs(q);
		return querySnapshot;
	} catch (e) {
		console.error('Error reading database: ', e);
		notifications.danger('Error reading database', 3000);
	}
};

export const writeServiceUpdate = async (
	serviceId: string,
	paid: boolean,
	pickedUp: boolean,
	pickUpDate: string
): Promise<any | undefined> => {
	const serviceRef = doc(db, 'services', serviceId);
	try {
		const querySnapshot = await setDoc(
			serviceRef,
			{ paid: paid, pickedUp: pickedUp, pickUpDate: pickUpDate },
			{ merge: true }
		);
		notifications.success('Order Updated', 2000);
		return querySnapshot;
	} catch (e) {
		console.error('Error updating database: ', e);
		notifications.danger(`Error updating database ${e}`, 3000);
	}
};

export const writeCustomerUpdate = async (customer: Customer): Promise<void> => {
	const customerRef = doc(db, 'customers', customer.id);
	try {
		await setDoc(
			customerRef,
			{
				lastName: customer.lastName,
				firstName: customer.firstName,
				phone: customer.phone,
				email: customer.email,
				notes: customer.notes,
				nickname: customer.nickname,
				searchTerms: customer.searchTerms
			},
			{ merge: true }
		);
		let updatedUserData = {};
		allCustomers.update((customers) => {
			const updatedCustomers = customers.map((localCustomer) =>
				localCustomer.id === customer.id ? { ...localCustomer, ...customer } : localCustomer
			);
			return updatedCustomers;
		});
		notifications.success('Customer Updated', 2000);
	} catch (e) {
		console.error('Error updating customer: ', e);
		notifications.danger('Error updating customer', 3000);
		throw e;
	}
};

export const deleteService = async (serviceId: string): Promise<any | undefined> => {
	const serviceRef = doc(db, 'services', serviceId);
	try {
		const querySnapshot = await deleteDoc(serviceRef);
		notifications.success('Service Deleted', 2000);
		return querySnapshot;
	} catch (e) {
		console.error('Error deleting service: ', e);
		notifications.danger('Error deleting service', 3000);
	}
};

export const deleteCustomer = async (customer: Customer): Promise<any | undefined> => {
	const customerRef = doc(db, 'customers', customer.id);
	try {
		// Delete customer in firestore
		const querySnapshot = await deleteDoc(customerRef);
		const batch = writeBatch(db);

		// Get all services attached to that customer
		const q = query(servicesCollectionRef, where('customerId', '==', customerRef));
		const serviceQuerySnapshot = await getDocs(q);

		// Batch delete all services with a reference to customer
		serviceQuerySnapshot.docs.forEach((document) => batch.delete(document.ref));
		await batch.commit();

		// Update local state only after all db actions are successful
		allCustomers.update((customers) =>
			customers.filter((localCustomer) => localCustomer.id !== customer.id)
		);
		notifications.success('Customer Deleted', 2000);
		return querySnapshot;
	} catch (e) {
		console.error('Error deleting customer: ', e);
		notifications.danger('Error deleting customer', 3000);
	}
};
