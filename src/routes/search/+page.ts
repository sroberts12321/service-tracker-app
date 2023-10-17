import type { PageLoad } from './$types';
import { readStore } from '$lib/firebase';

let customerStore: any[] = [];
let id = '';
let lastName = '';
let firstName = '';
let nickname = '';
let phone = '';
let email  = '';
let balance = 0;
let notes = '';
let customer: any = {
    id, 
    lastName, 
    firstName, 
    nickname, 
    phone, 
    email, 
    balance, 
    notes
};
export const load = (async () => {
	const getCustomers = async () => {
		const res = await readStore('customers')
		.then((returnedCustomers) => {
			customerStore = [];
			 returnedCustomers.forEach((doc) => {
				customer = {
					id: doc.id,
					lastName: doc.get('lastName'),
					firstName: doc.get('firstName'),
					nickname: doc.get('nickname'),
					phone: doc.get('phone'),
					email: doc.get('email'),
                    balance: doc.get('balance'),
					notes: doc.get('notes')
				}
				if (customer.notes === undefined) {
					customer.notes = ' ';
				}
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