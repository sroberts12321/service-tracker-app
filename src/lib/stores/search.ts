import { writable } from 'svelte/store';
import { debounce } from 'lodash';
import type { Customer } from '$lib/customer';

export const createSearchStore = (data: Customer[]) => {
	const { subscribe, set, update } = writable({
		data: data,
		filtered: data as Customer[],
		search: ''
	});

	const debouncedSearch = debounce((searchTerm: string, storeData: Customer[]) => {
		update((store) => {
			if (!searchTerm.trim()) {
				store.filtered = [];
				return store;
			}

			store.filtered = storeData.filter((item: Customer) => {
				return item.searchTerms.toLowerCase().includes(searchTerm.toLocaleLowerCase());
			});
			return store;
		});
	}, 450);

	return {
		subscribe,
		set,
		update,
		setSearch: (term: string) => {
			update((store) => ({ ...store, search: term }));
			debouncedSearch(term, data);
		}
	};
};
