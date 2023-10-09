<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { readCustomerDetail } from '$lib/firebase';
	import type { PageData } from './$types';
	import CustomerDetail from '$lib/CustomerDetail.svelte';
	import { getModalStore, type ModalSettings, type ModalComponent} from '@skeletonlabs/skeleton';

	export let data: PageData;

	const modalStore = getModalStore();
	let customerDetailStore: any = [];

	const searchCustomers = data.customers.map((customer) => ({
		...customer,
		searchTerms: `${customer.lastName} ${customer.firstName} ${customer.email}`
	}));

	const searchStore = createSearchStore(searchCustomers);
	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.trigger(settings);
	}

	async function handleCustomerSelect(customerObject: any) {
		const res = await readCustomerDetail(customerObject.id)
		.then((returnedServices) => {
			customerDetailStore = [];
			 returnedServices.forEach((doc: any) => {
				let formattedDropOffDate = doc.get('dropOffDate');
				let service: any = {
					serviceId    : doc.id,
					dropOffDate  : doc.get('dropOffDate'),
					paid         : doc.get('paid'),
					pickUpDate   : doc.get('pickUpDate'),
					pickedUp     : doc.get('pickedUp'),
					referenceNum : doc.get('referenceNum'),
					typeOfService: doc.get('typeOfService'),
					notes        : doc.get('notes')
				}
				customerDetailStore = [...customerDetailStore, service];
			});
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			const c: ModalComponent = { ref: CustomerDetail };
			const settings: ModalSettings = {
				type: 'component',
				component: c,
				title: `${customerObject.firstName} ${customerObject.lastName}`,
				body: `Account Notes: \n${customerObject.notes}`,
				meta: customerDetailStore,
				buttonTextCancel: 'Close',
				response: (r) => console.log('response:', r)
			};
			modalComponentForm(settings, c);
		})

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
		{#if $searchStore.search.length < 1}
		<div class="">
		</div>
		{:else}
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
		{/if}

	</div>
</div>
