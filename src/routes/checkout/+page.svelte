<script lang="ts">
	
	import { onDestroy } from 'svelte';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { readCustomerDetail } from '$lib/firebase';
	import type { PageData } from './$types';
	import CustomerDetail from '$lib/CustomerDetail.svelte';
	import { getModalStore, type ModalSettings, type ModalComponent} from '@skeletonlabs/skeleton';

	let referenceNum: string = '';
	export let data: PageData;

	const modalStore = getModalStore();
	let customerServiceObject: any = {
		"allServices": [],
		"activeServices": []
	};


	const searchServices = data.services.map((service) => ({
		...service,
		searchTerms: `${service.referenceNum} ${service.dropOffDate} ${service.typeOfService}`
	}));

	const searchStore = createSearchStore(searchServices);
	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	async function handleServiceSelect(serviceObject: any) {
		console.log(JSON.stringify(serviceObject));
	}

</script>

<svelte:head>
	<title>Checkout</title>
	<meta name="description" content="Checkout Order" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5 mt-10">
		<h1 class="h1">Checkout Order</h1>
		<form id="checkoutForm">
			<label class="label mt-5">
				<span>Reference Number</span>
				<input class="input" bind:value={$searchStore.search} type="text" placeholder="" />
			</label>
		<button id="checkoutBtn" type="button" class="btn variant-filled mt-5">
			<span>Find</span>
		</button>
	</div>
</div>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="w-4/5 place-content-center auto-cols-auto flex-row grid-cols-3 grid" >
		{#if $searchStore.search.length < 1}
		<div class="">
		</div>
		{:else}
			{#each $searchStore.filtered as service}
			<div class="card card-hover p-4 text-center m-5 grid content-between">
				<div class="m-1">
					<h3 class="h3">{service.lastName}, {service.firstName}</h3>
				</div>
				<div class="m-1">
					<button on:click={handleServiceSelect(service)} class="btn btn-sm variant-filled-tertiary h">SELECT</button>
				</div>
			</div>
			{/each}
		{/if}
	</div>
</div>

