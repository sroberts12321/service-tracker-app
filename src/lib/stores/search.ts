import { writable } from 'svelte/store';
import { debounce } from 'lodash';
import type { Customer } from '$lib/customer';

export const createSearchStore = (data: Customer[]) => {
	const { subscribe, set, update } = writable({
		data: data,
		filtered: data as Customer[],
		search: ''
	});

	const searchCustomers = (searchTerm: string, storeData: Customer[]) => {
		if (!searchTerm.trim()) {
			return update((store) => {
				store.filtered = [];
				return store;
			});
		}

		return update((store) => {
			store.filtered = storeData.filter((item: Customer) => {
				return item.searchTerms.toLowerCase().includes(searchTerm.toLowerCase());
			});
			return store;
		});
	};

	const debouncedSearch = debounce(searchCustomers, 450);

	return {
		subscribe,
		set,
		update,
		setSearch: (term: string) => {
			update((store) => ({ ...store, search: term }));
			debouncedSearch(term, data);
		},
		searchImmediately: (term: string) => {
			update((store) => ({ ...store, search: term }));
			debouncedSearch.cancel();
			searchCustomers(term, data);
		}
	};
};
