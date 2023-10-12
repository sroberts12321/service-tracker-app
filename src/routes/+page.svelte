<script lang="ts">	
	import { Autocomplete, InputChip, type AutocompleteOption } from '@skeletonlabs/skeleton';
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
			console.log('initial data fetching successful');
		})
	})

	let customerSelection = '';
	let selectedCustomerId = '';
	let dropOffDate = (new Date()).toJSON().slice(0, 10);
	let paid = false;
	let pickUpDate  = '';
	let pickedUp = false;
	let isReady = false;
	let notes = '';
	let referenceNum: string;
	let lastEnteredRefNum: string;
	let listOfRefNums: string[] = [];
	let typeOfService = 'Cleaning';
	let refNumRegEx = new RegExp("[0-9]{'{'}4{'}'}$");
	let numValidationRegEx = new RegExp('^[0-9]+$');
	$: if (listOfRefNums.length > 0) {
		iterateRefNum();
	}

	async function addNewService() {
		const uniqueId = crypto.randomUUID();
		let service: any = {
			serviceId: uniqueId,
			customerId: selectedCustomerId,	
			dropOffDate: dropOffDate,
			paid: paid,
			isReady: isReady,
			pickUpDate: pickUpDate,
			pickedUp: pickedUp,
			referenceNum: listOfRefNums.toString(),
			typeOfService: typeOfService,
			notes: notes,
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
		if (Number(lastEnteredRefNum) > 9998) {
			console.log(lastEnteredRefNum + " what is the last num");
			referenceNum = '0000';
		} else {	
			referenceNum = (Number(lastEnteredRefNum) + 1).toString();
			referenceNum = (0).toString().repeat(4 - referenceNum.length) + referenceNum
		}
	}

	function clearForm() {
    	customerSelection = '';
    	dropOffDate = (new Date()).toJSON().slice(0, 10);
    	paid = false;
    	typeOfService = 'Cleaning';
		listOfRefNums = [];
		notes = '';
		increment();
	}	

	function inputChipValidation(event: Event) {
		if (event.data != null) {
			if (!numValidationRegEx.test(event.data) || referenceNum.length > 4) {
				referenceNum = referenceNum.slice(0, referenceNum.length - 1);
			}
		}
	}

	function onChipAdd() {
		lastEnteredRefNum = referenceNum;
	}

	function iterateRefNum() {
		if (lastEnteredRefNum != null) {
			increment();
		}
	}

	function onCustomerSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		selectedCustomerId = event.detail.value;
		customerSelection = event.detail.label;
	}

</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="container h-full mx-auto flex justify-center items-center">
		<div class="space-y-5 mt-10">
			<h1 class="h1">Add Service Order</h1>
			<form id="orderForm">
				<div class="grid grid-cols-4">
					<label class="label mt-5 mr-5 col-span-2">
						<span class="h4">Customer</span>
						<input class="input w-full" type="text" bind:value={customerSelection} placeholder="Search..." />
						<div class="card w-full max-w max-h-20 p-4 overflow-y-scroll" tabindex="-1">
							<Autocomplete bind:input={customerSelection} options={customerStore} on:selection={onCustomerSelection} />
						</div>
					</label>
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label mt-5 col-span-2">
						<span class="h4">Service Number</span>
						<InputChip on:add={onChipAdd} on:input={inputChipValidation} hidden={true} maxlength={4} size={0} type="text" bind:input={referenceNum} bind:value={listOfRefNums} name="chips" placeholder={"0000"}/>
					</label>
					<label class="label mt-5 mr-5 col-span-2">
						<span class="h4">Dropoff Date</span>
						<input class="input" type="date" bind:value={dropOffDate}/>
					</label>
					<label class="label mt-5 col-span-2 row-span-2">
						<span class="h4">Notes: </span>
						<textarea bind:value={notes} class="textarea" rows="4" placeholder="Notes for the order" />
					</label>
					<label class="label mt-5 mr-5 flex flex-col col-span-1">
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
					<div class="mt-5 grid grid-cols-2 col-span-1">
						<p class="col-span-2">
							<span class="h4">Order Status</span>
						</p>
						<label class="flex items-center space-x-2">
							<input bind:checked={paid} class="checkbox" type="checkbox" />
							<p>Paid</p>
						</label>
					</div>
				</div>
			</form>
			<button disabled={!(listOfRefNums.length > 0) || !customerSelection || !dropOffDate} on:click={addNewService} type="button" class="btn variant-filled">
				<span>Add</span>
			</button>
		</div>
	</div>
</div>
<Toast />
