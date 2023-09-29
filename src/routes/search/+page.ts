import type { PageLoad } from './$types';
import { readStore } from '$lib/stores';

let customerStore: any[] = [];
let id = '';
let lastName = '';
let firstName = '';
let phone = '';
let email  = '';
let balance = 0;
let notes = '';
let customer: any = {
    id, 
    lastName, 
    firstName, 
    phone, 
    email, 
    balance, 
    notes
};
export const load = (async () => {
	const getCustomers = async () => {
		const res = await readStore('customers')
		.then((returnedCustomers) => {
			 returnedCustomers.forEach((doc) => {
				customer = {
					id: doc.id,
					lastName: doc.get('lastName'),
					firstName: doc.get('firstName'),
					phone: doc.get('phone'),
					email: doc.get('email'),
                    balance: doc.get('balance'),
					notes: doc.get('notes')
				}
				customerStore = [...customerStore, customer];
			});
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			console.log('Experiment completed');
		})
		return customerStore;
	}
    return {
        customers: getCustomers(),
		    }
}) satisfies PageLoad;