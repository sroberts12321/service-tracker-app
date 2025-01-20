import type { Updater, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

type Customer = {
	id: string;
	documentId: string;
	lastName: string;
	firstName: string;
	nickname: string;
	phone: string;
	email: string;
	balance: number;
	notes: string;
	searchTerms: string;
	label: string;
};

const initialCustomerInfoState: Customer = {
	id: '',
	documentId: '',
	lastName: '',
	firstName: '',
	nickname: '',
	phone: '',
	email: '',
	balance: 0,
	notes: '',
	searchTerms: '',
	label: ''
};

// List of all Services
export let allServices: Writable<[]> = writable([]);
// List of all Services that have not been picked up (makes switching between the two faster)
export let activeServices: Writable<[]> = writable([]);
// One of many objects that exist in one of the two lists above
export let serviceDetail: Writable<{}> = writable({});

// List of all Customers
export let allCustomers: Writable<[]> = writable([]);

// One of the many objects that exist in the allCustomers list
export let customerInfo = writable<Customer>(initialCustomerInfoState);
