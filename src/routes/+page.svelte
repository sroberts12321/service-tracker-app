<script lang="ts">	
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { notifications } from '$lib/stores/notifications';
	import { onMount } from 'svelte';
	import { readStore, writeStore } from '$lib/firebase';
	import Toast from "$lib/Toast.svelte";

	let customerStore: any = [];
	let customer: any = {};

	onMount(async () => {
		const res = await readStore('customers')
		.then((returnedCustomers) => {
			customerStore = [];
			 returnedCustomers.forEach((doc) => {
                let customerName = `${doc.get('lastName')}, ${doc.get('firstName')}`;
				customer = {
                    label: customerName,
                    value: doc.id,
                    keywords: customerName
				}
				customerStore = [...customerStore, customer];
			});
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			console.log('customer fetching successful');
		})
	})

	let customerSelection = '';
	let selectedCustomerId = '';
	let dropOffDate = (new Date()).toJSON().slice(0, 10);
	let paid = false;
	let pickUpDate  = '';
	let pickedUp = false;
	let referenceNum: number;
	let typeOfService = 'Cleaning';

	async function addNewService() {
		const uniqueId = crypto.randomUUID();
		let service: any = {
			serviceId: uniqueId,
			customerId: selectedCustomerId,	
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
			notifications.success('Service Successfully Saved', 3000);
		});
	}
	function increment() {
		if (referenceNum > 1000) {
			referenceNum = 0;
		} else {	
			referenceNum++;
		}
	}

	function clearForm() {
    	customerSelection = '';
    	dropOffDate = (new Date()).toJSON().slice(0, 10);
    	paid = false;
    	pickUpDate  = '';
    	pickedUp = false;
    	typeOfService = 'Cleaning';
		increment();
	}


	function onCustomerSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		selectedCustomerId = event.detail.value;
		customerSelection = event.detail.label;
		console.log(`${selectedCustomerId}: this is the customer selection label`);
}
				
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="container h-full mx-auto flex justify-center items-center">
		<div class="space-y-5 mt-10">
			<h1 class="h1">Add Service Order</h1>
			<form id="orderForm">
				<div class="grid grid-cols-2">
					<label class="label mt-5 mr-5">
						<span>Customer</span>
						<input class="input w-full" type="text" bind:value={customerSelection} placeholder="Search..." />
						<div class="card w-full max-w max-h-20 p-4 overflow-y-scroll" tabindex="-1">
							<Autocomplete bind:input={customerSelection} options={customerStore} on:selection={onCustomerSelection} />
						</div>
					</label>
					<label class="label mt-5">
						<span>Reference Number</span>
						<input class="input" type="text" bind:value={referenceNum} placeholder="0000" />
					</label>
					<label class="label mt-5 mr-5">
						<span>Dropoff Date</span>
						<input class="input" type="date" bind:value={dropOffDate}/>
					</label>
					<label class="label mt-5">
						<span>Pickup Date</span>
						<input class="input" type="date" placeholder="" />
					</label>
					<label class="label mt-5 mr-5">
						<span>Type of Service</span>
						<select class="select" bind:value={typeOfService}>
							<option value="Cleaning">Cleaning</option>
							<option value="Alterations">Alterations</option>
						</select>
					</label>
					<div class="mt-5 grid grid-cols-2">
						<p class="col-span-2">
							<span>Order Status</span>
						</p>
						<label class="flex items-center space-x-2">
							<input bind:value={paid} class="checkbox" type="checkbox" />
							<p>Paid</p>
						</label>
						<label class="flex items-center space-x-2">
							<input bind:value={pickedUp} class="checkbox" type="checkbox" />
							<p>Picked up</p>
						</label>
					</div>
					<label class="label mt-5 col-span-2">
						<span>Notes: </span>
						<textarea class="textarea" rows="4" placeholder="Notes for the order" />
					</label>
				</div>
			</form>
			<button disabled={!referenceNum || !customerSelection || !dropOffDate} on:click={addNewService} type="button" class="btn variant-filled">
				<span>Add</span>
			</button>
		</div>
	</div>
</div>
<Toast />
