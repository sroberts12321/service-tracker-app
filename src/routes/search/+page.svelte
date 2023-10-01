<script lang="ts">
	import { onDestroy } from 'svelte';
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

	function handleCustomerSelect(customerObject) {
		console.log(`${customerObject.id}: does the id show up?`)
	}
</script>

<svelte:head>
	<title>Search</title>
	<meta name="description" content="Find Customer" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5 mt-10 mb-10">
		<h1 class="h1">Find Customer</h1>
		<form id="searchForm">
			<label class="label mt-5">
				<span>Last Name</span>
				<input bind:value={$searchStore.search} class="input" type="text" placeholder="Search..." />
			</label>
		</form>
	</div>
</div>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="w-4/5 place-content-center auto-cols-auto flex-row grid-cols-3 grid" >
		{#each $searchStore.filtered as customer}
		<div class="card card-hover p-4 text-center m-5 grid content-between">
			<div class="m-1">
				<h3 class="h3">{customer.lastName}, {customer.firstName}</h3>
			</div>
			<div class="m-1">
				<button on:click={handleCustomerSelect(customer)} class="btn btn-sm variant-filled-tertiary h">SELECT</button>
			</div>
		</div>
		{/each}
	</div>
</div>
