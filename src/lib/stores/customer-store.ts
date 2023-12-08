import type { Updater, Writable } from 'svelte/store';
import { writable } from 'svelte/store';
// import type { Customer } from '$lib/customer';

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
}

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
}

// List of all Services
export let allServices = writable([]);
// Subset of all services that is here to make switching between the two faster
export let activeServices = writable([]);
// One of many objects that exist in one of the two lists above
export let serviceDetail = writable({});

// List of all Customers
export let allCustomers = writable([]);

// List formatted for the autoselect options in the autocomplete field
export let customerAutoSelectOptions = writable([]);

// One of the many objects that exist in the allCustomers list
export let customerInfo = writable<Customer>(initialCustomerInfoState);
