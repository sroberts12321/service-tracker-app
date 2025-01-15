import { writable } from 'svelte/store';
import { debounce } from 'lodash';

export const createSearchStore = (data: any) => {
	const { subscribe, set, update } = writable({
		data: data,
		filtered: [],
		search: ''
	});

	const debouncedSearch = debounce((searchTerm: string, storeData: any[]) => {
		update((store) => {
			if (!searchTerm.trim()) {
				store.filtered = [];
				return store;
			}

			store.filtered = storeData.filter((item: any) => {
				return item.searchTerms.toLowerCase().includes(searchTerm.toLocaleLowerCase());
			});
			return store;
		});
	}, 300);

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
