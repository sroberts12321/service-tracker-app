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
	let referenceNum: string;
	let typeOfService = 'Cleaning';
	let refNumRegEx = new RegExp("[0-9]{'{'}4{'}'}$");
	let numValidationRegEx = new RegExp('^[0-9]+$');
	let listOfNumInput: string[] = [];

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
		if (Number(referenceNum) > 1000) {
			referenceNum = '0000';
		} else {	
			referenceNum = (Number(referenceNum) + 1).toString();
			referenceNum = (0).toString().repeat(4 - referenceNum.length) + referenceNum
		}
	}

	function formatRefNum(refNum: string) {
		if (refNum.length < 4) {
			return(0).toString().repeat(4 - referenceNum.length) + referenceNum
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

	/** @param {FocusEvent} event */
	function handleOnBlur(event) {
		if (!refNumRegEx.test(referenceNum)) {
			if (referenceNum.length < 4) {
				referenceNum = (0).toString().repeat(4 - referenceNum.length) + referenceNum
			}
		}
		listOfNumInput = [];
	}

	/** @param {KeyboardEvent}*/
	function handleRefNumValidation(event) {
		let isBackspace = event.keyCode === 8;
		if (!numValidationRegEx.test(event.key) && !isBackspace) {
			event.preventDefault();
		} else {
			if (isBackspace) {
				listOfNumInput = [...listOfNumInput.slice(0, listOfNumInput.length -1)];
			} else {
				listOfNumInput = [...listOfNumInput, event.key]
				if (listOfNumInput.length > 4) {
					listOfNumInput = [...listOfNumInput.slice(0, listOfNumInput.length -1)];
					event.preventDefault();
				}	
			}
		}
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
						<span class="h4">Customer</span>
						<input class="input w-full" type="text" bind:value={customerSelection} placeholder="Search..." />
						<div class="card w-full max-w max-h-20 p-4 overflow-y-scroll" tabindex="-1">
							<Autocomplete bind:input={customerSelection} options={customerStore} on:selection={onCustomerSelection} />
						</div>
					</label>
					<label class="label mt-5">
						<span class="h4">Reference Number</span>
						<input class="input" on:blur={handleOnBlur} on:keydown={handleRefNumValidation} type="text" bind:value={referenceNum} placeholder="0000" />
					</label>
					<label class="label mt-5 mr-5">
						<span class="h4">Dropoff Date</span>
						<input class="input" type="date" bind:value={dropOffDate}/>
					</label>
					<label class="label mt-5">
						<span class="h4">Pickup Date</span>
						<input class="input" type="date" placeholder="" />
					</label>
					<label class="label mt-5 mr-5 flex flex-col">
						<div>
							<span class="h4">Type of Service</span>
						</div>
						<div class="grid content-between">
							{#each ['Cleaning', 'Alterations'] as service}
								<label>
									<input class="" type='radio' name='serviceType' value={service} bind:group={typeOfService} />
									{service}
								</label>
							{/each}
						</div>
					</label>
					<div class="mt-5 grid grid-cols-2">
						<p class="col-span-2">
							<span class="h4">Order Status</span>
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
						<span class="h4">Notes: </span>
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
