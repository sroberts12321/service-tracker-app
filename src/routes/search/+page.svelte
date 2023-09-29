<script lang="ts">
	import type { Customer } from '$lib/customer';
	import { onMount, onDestroy } from 'svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import type { PageData } from './$types';

	export let data: PageData;

	const searchCustomers = data.customers.map((customer) => ({
		...customer,
		searchTerms: `${customer.lastName} ${customer.firstName} ${customer.email}`
	}));

	const searchStore = createSearchStore(searchCustomers);
	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	onMount(async () => {
		console.log(JSON.stringify(data) + ": this is the data");
	})

	let id = '';
	let lastName = '';
	let firstName = '';
	let phone = '';
	let email  = '';
	let balance = 0;
	let notes = '';
	$: searchTerms = `${lastName} ${firstName} ${email}`;
	let customer: Customer = {
		id, 
		lastName, 
		firstName, 
		phone, 
		email, 
		balance, 
		notes, 
		searchTerms
	};

	const addCustomer = () => {
		console.log(JSON.stringify(searchStore.search) + " : what does the search store say?");
		// const uniqueId = crypto.randomUUID();
		// let customer: Customer = {
		// 	id: uniqueId,
		// 	lastName: lastName,
		// 	firstName: firstName,
		// 	phone: phone,
		// 	email: email,
		// 	balance: balance,
		// 	notes: notes,
		// 	searchTerms: searchTerms
		// }
		// writeStore('customers', customer);
		// clearCustomer();
	}	

	function clearCustomer() {
		id = '';
		lastName = '';
		firstName = '';
		phone = '';
		email  = '';
		balance = 0;
		notes = '';
		searchTerms = '';
	}	

</script>

<svelte:head>
	<title>Search</title>
	<meta name="description" content="Find Customer" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5 mt-10">
		<h1 class="h1">Find Customer</h1>
		<form id="searchForm">
			<label class="label mt-5">
				<span>Last Name</span>
				<input bind:value={$searchStore.search} class="input" type="text" placeholder="Search..." />
			</label>
		<button on:click={addCustomer} id="searchBtn" type="button" class="btn variant-filled mt-5">
			<span>Find</span>
		</button>	
	</div>
</div>
<div>
	{#each $searchStore.filtered as customer}
	<div>
		<h2>{customer.lastName}</h2>
		<h3>{customer.firstName}</h3>
		<p>{customer.email}</p>
	</div>
	{/each}
</div>
