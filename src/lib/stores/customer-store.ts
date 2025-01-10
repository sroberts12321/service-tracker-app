import type { Updater, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

type Customer = {
	id: string;
	lastName: string;
	firstName: string;
	nickname: string;
	phone: string;
	email: string;
	balance: number;
	notes: string;
	searchTerms: string;
};

export type ChangeFn<T> = (args: { curr: T; next: T }) => T;

export const overridable = <T>(store: Writable<T>, onChange?: ChangeFn<T>) => {
	const update = (updater: Updater<T>, sideEffect?: (newValue: T) => void) => {
		store.update((curr) => {
			const next = updater(curr);
			let res: T = next;
			if (onChange) {
				res = onChange({ curr, next });
			}

			sideEffect?.(res);
			return res;
		});
	};

	const set: typeof store.set = (curr) => {
		update(() => curr);
	};

	return {
		...store,
		update,
		set
	};
};
const initialCustomerInfoState: Customer = {
	id: '',
	lastName: '',
	firstName: '',
	nickname: '',
	phone: '',
	email: '',
	balance: 0,
	notes: '',
	searchTerms: ''
};

// List of all Services
export let allServices: Writable<[]> = writable([]);
// List of all Services that have not been picked up (makes switching between the two faster)
export let activeServices: Writable<[]> = writable([]);
// One of many objects that exist in one of the two lists above
export let serviceDetail: Writable<{}> = writable({});

// List of all Customers
export let allCustomers: Writable<[]> = writable([]);

// List formatted for the autoselect options in the autocomplete field
export let customerAutoSelectOptions: Writable<[]> = writable([]);

// One of the many objects that exist in the allCustomers list
export let customerInfo = writable<Customer>(initialCustomerInfoState);
