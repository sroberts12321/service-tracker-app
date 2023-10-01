<script lang="ts">	
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { notifications } from '$lib/stores/notifications';
	import Toast from '$lib/stores/Toast.svelte';
	import { writeStore } from '$lib/stores';
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


	let customerSelection = '';
	let dropOffDate = '';
	let paid = false;
	let pickUpDate  = '';
	let pickedUp = 0;
	let referenceNum = 0;
	let typeOfService = '';

	const customerOptions: AutocompleteOption<string>[] = $searchStore.filtered;

	async function addNewService() {
		const uniqueId = crypto.randomUUID();
		let service: any = {
			customerId: customerSelection,	
			dropOffDate: dropOffDate,
			paid: paid,
			pickUpDate: pickUpDate,
			pickedUp: pickedUp,
			referenceNum: referenceNum,
			typeOfService: typeOfService,
		}

		writeStore('services', service).then((returnedSomething) => {
			 JSON.stringify(returnedSomething + ': returned from write store')
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			clearForm();
			notifications.success('Customer Successfully Saved', 3000);
		});
	}

	function clearForm() {
    	customerSelection = '';
    	id = '';
    	customerId = '';
    	dropOffDate = '';
    	paid = false;
    	pickUpDate  = '';
    	pickedUp = 0;
    	referenceNum = 0;
    	typeOfService = '';
	}


	function onCustomerSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		customerSelection = event.detail.label;
}
				
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5 mt-10">
		<h1 class="h1">Add Service Order</h1>
		<form id="orderForm">
			<div class="grid grid-cols-2">
				<label class="label mt-5 mr-5">
					<span>Customer</span>
					<input class="input w-full" type="search" name="demo" bind:value={$searchStore.search} placeholder="Search..." />
					<div class="card w-full max-w max-h-20 p-4 overflow-y-scroll" tabindex="-1">
						<Autocomplete bind:input={customerSelection} options={$searchStore.filtered} on:selection={onCustomerSelection} />
					</div>
				</label>
				<label class="label mt-5">
					<span>Reference Number</span>
					<input class="input" type="text" placeholder="0000" />
				</label>
				<label class="label mt-5 mr-5">
					<span>Dropoff Date</span>
					<input class="input" type="date" placeholder="" />
				</label>
				<label class="label mt-5">
					<span>Pickup Date</span>
					<input class="input" type="date" placeholder="" />
				</label>
				<label class="label mt-5 mr-5">
					<span>Type of Service</span>
					<select class="select">
						<option value="1">Cleaning</option>
						<option value="2">Alterations</option>
					</select>
				</label>
				<div class="mt-5 grid grid-cols-2">
					<p class="col-span-2">
						<span>Order Status</span>
					</p>
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" />
						<p>Paid</p>
					</label>
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" />
						<p>Picked up</p>
					</label>
				</div>
				<label class="label mt-5 col-span-2">
					<span>Notes: </span>
					<textarea class="textarea" rows="4" placeholder="Notes for the order" />
				</label>
			</div>
		</form>
		<button on:click={addNewService} type="button" class="btn variant-filled">
			<span>Add</span>
		</button>
	</div>
</div>
<Toast />
