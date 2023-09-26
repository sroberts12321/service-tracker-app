import type { PageLoad } from './$types';
import { readStore } from '$lib/stores';
import type { Customer } from '$lib/customer.ts';

let customerStore: Customer[] = [];

export const load = (async ({ setHeaders }) => {
    readStore('customers')
		.then((returnedCustomers) => {
			 returnedCustomers.forEach((doc: any) => {
				let customer: Customer = {
					id: doc.id,
					lastName: doc.get('lastName'),
					firstName: doc.get('firstName'),
					phone: doc.get('phone'),
					email: doc.get('email'),
                    balance: doc.get('balance')
				}
				customerStore = [...customerStore, customer];
			});
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			console.log('Experiment completed');
		});	

    // const res = await fetch().then (res => res.json());
    const data = customerStore;

    // setHeaders({
    //     age: res.headers.get('age'),
    //     "cache-control": res.headers.get('cache-control')
    // });


    return data;
}) satisfies PageLoad;