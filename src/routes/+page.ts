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
			customerStore = [];
			 returnedCustomers.forEach((doc) => {
                let customerName = `${doc.get('lastName')}, ${doc.get('firstName')}`;
				customer = {
                    label: customerName,
                    value: doc.id,
                    keywords: customerName
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