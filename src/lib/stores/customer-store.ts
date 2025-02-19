import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { Customer } from '../customer';
import { Service } from '../service';

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
export const allServices: Writable<Service[]> = writable([]);
// List of all Services that have not been picked up (makes switching between the two faster)
export const activeServices: Writable<Service[]> = writable([]);
// One of many objects that exist in one of the two lists above
export const serviceDetail: Writable<object> = writable(Object);

// List of all Customers
export const allCustomers: Writable<Customer[]> = writable([]);

// One of the many objects that exist in the allCustomers list
export const customerInfo = writable<Customer>(initialCustomerInfoState);
