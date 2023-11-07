import type { PageLoad } from './$types';
import { readStore } from '$lib/firebase';
import { allCustomers } from '$lib/stores/customer-store';
import type { Customer } from '$lib/customer';

let customerStore: any[] = [];
let id = '';
let lastName = '';
let firstName = '';
let nickname = '';
let phone = '';
let email  = '';
let balance = 0;
let notes = '';
let searchTerms = '';
let customer: Customer = {
    id, 
    lastName, 
    firstName, 
    nickname, 
    phone, 
    email, 
    balance, 
    notes,
	searchTerms
};

export const load = (async () => {
	const getCustomers = async () => {
		const res = await readStore('customers')
		.then((returnedCustomers) => {
			customerStore = [];
			allCustomers.set([]);
			 returnedCustomers.forEach((doc) => {
				customer = {
					id: doc.id,
					lastName: doc.get('lastName'),
					firstName: doc.get('firstName'),
					nickname: doc.get('nickname'),
					phone: doc.get('phone'),
					email: doc.get('email'),
                    balance: doc.get('balance'),
					notes: doc.get('notes'),
					searchTerms: doc.get('searchTerms')
				}
				if (customer.notes === undefined) {
					customer.notes = ' ';
				}
				allCustomers.update(customers => [...customers, customer]);
				customerStore = [...customerStore, customer];
			});
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			console.log('customer fetching successful');
		})
		return customerStore;
	}
    return {
        customers: getCustomers(),
		    }
}) satisfies PageLoad;