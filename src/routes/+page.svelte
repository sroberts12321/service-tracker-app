<script lang="ts">	
	import { Autocomplete, InputChip, popup, type AutocompleteOption, type PopupSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { readStore, writeStore } from '$lib/firebase';
	import Toast from "$lib/Toast.svelte";
	import { notifications } from '$lib/stores/notifications';
	import { allCustomers, customerAutoSelectOptions } from '$lib/stores/customer-store';
	import type { Customer } from '$lib/customer';

	let customerStore: any = [];
	customerStore = $customerAutoSelectOptions;
	customerAutoSelectOptions.subscribe((newStore) => customerStore = newStore);
	let id = '';
	let documentId = '';
	let lastName = '';
	let firstName = '';
	let nickname = '';
	let phone = '';
	let email  = '';
	let balance = 0;
	let notes = '';
	let searchTerms = '';
	let label = '';
	let customerSelection = '';
	let selectedCustomerId = '';
	$: dropOffDate = convertDate((new Date()).toLocaleDateString(), "initial");
	let paid = false;
	let pickUpDate  = '';
	let pickedUp = false;
	let isReady = false;
	let referenceNum: string;
	let lastEnteredRefNum: string;
	let listOfRefNums: string[] = [];
	let typeOfService = 'Cleaning';
	let numValidationRegEx = new RegExp('^[0-9]+$');
	$: if (listOfRefNums.length > 0) {
		iterateRefNum();
	}
	let customer: Customer = {
		id,
		documentId,
		lastName,
		firstName,
		nickname,
		phone,
		email,
		balance,
		notes,
		searchTerms,
		label
	};
	let customerSelectLabel = '';
	let customerSelectValue = '';
	let customerSelectKeywords = '';
	
	let customerSelectionEntry: any = {
		label: customerSelectLabel,
		value: customerSelectValue,
		keywords: customerSelectKeywords
	}

	onMount(async () => {
		if (customerStore.length > 0) {
			console.log("Data not updated");
		} else {
			console.log("Fetching Data");
			const res = await readStore('customers')
			.then((returnedCustomers) => {
				customerStore = [];
				allCustomers.set([]);
				customerAutoSelectOptions.set([]);
				returnedCustomers.forEach((doc) => {
					customer = {
						id: doc.id,
						documentId: doc.get('documentId'),
						lastName: doc.get('lastName'),
						firstName: doc.get('firstName'),
						nickname: doc.get('nickname'),
						phone: doc.get('phone'),
						email: doc.get('email'),
						balance: doc.get('balance'),
						notes: doc.get('notes'),
						searchTerms: doc.get('searchTerms'),
						label: `${doc.get('lastName')}, ${doc.get('firstName')}`
					}
					customerSelectionEntry = {
						label: `${doc.get('lastName')}, ${doc.get('firstName')}`,
						value: doc.id,
						keywords: doc.get('searchTerms')
					}
					if (customer.notes === undefined) {
						customer.notes = ' ';
					}
					allCustomers.update(customers => [...customers, customer]);
					customerAutoSelectOptions.update(customers => [...customers, customerSelectionEntry]);
				});
			})
			.catch((err) => {
				console.error(err);
				notifications.danger('Error Getting Customer Data', 3000);
			})
			console.log('customer fetching successful');
			customerStore = $customerAutoSelectOptions;
			return customerStore;
		}
	})



	function convertDate(dateStr: string, dateType: string) {
		let newDateList;
		let month;
		let day; 
		let year;
		let newDate;

		if (dateType === "initial") {
			newDateList = dateStr.split('/');
			month = newDateList[0];
			day = newDateList[1];
			year = newDateList[2];
		} else {
			newDateList = dateStr.split('-');
			month = newDateList[1];
			day = newDateList[2];
			year = newDateList[0];
		}

		if (month.length < 2) {
			month = `0${month}`;
		}

		if (day.length < 2) {
			day = `0${day}`;
		}

		if (dateType === "initial") {
			newDate = `${year}-${month}-${day}`;
		} else {
			newDate = `${month}/${day}/${year}`;
		}

		return newDate;
	}	

	async function addNewService() {
		const uniqueId = crypto.randomUUID();
		if (listOfRefNums.length > 0) {
			referenceNum = listOfRefNums.join(', ');
		}

		let service: any = {
			serviceId: uniqueId,
			customerId: selectedCustomerId,	
			dropOffDate: convertDate(dropOffDate, "database"),
			paid: paid,
			isReady: isReady,
			pickUpDate: pickUpDate,
			pickedUp: pickedUp,
			referenceNum: referenceNum,
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
		});
	}

	function increment() {
		if (Number(lastEnteredRefNum) > 9999) {
			referenceNum = '1';
		} else {	
			referenceNum = (Number(lastEnteredRefNum) + 1).toString();
		}
	}

	function clearForm() {
    	customerSelection = '';
    	dropOffDate = convertDate((new Date()).toLocaleDateString(), "initial");
    	paid = false;
    	typeOfService = 'Cleaning';
		notes = '';
		if (listOfRefNums.length > 0) {
			increment();
		} else {
			referenceNum = (Number(referenceNum) + 1).toString();
		}
		listOfRefNums = [];
	}	

	function inputChipValidation(event: Event) {
		if (event.data != null) {
			if (!numValidationRegEx.test(event.data) || referenceNum.length > 5) {
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

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom',
	}

</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="container h-full mx-auto flex justify-center items-center">
		<div>
			<h3 class="h2 text-primary-500">Add Service Order</h3>
			<form id="orderForm">
				<div class="grid grid-cols-4">
					<label class="label mt-1 mr-5 col-span-2">
						<span class="h4">Customer</span>
						<input
							class="input autocomplete"
							type="search"
							name="autocomplete-search"
							bind:value={customerSelection}
							placeholder="Search..."
							use:popup={popupSettings}
						/>
						<div data-popup="popupAutocomplete" class="max-h-20 overflow-y-scroll card w-72">
							<Autocomplete
								bind:input={customerSelection}
								options={customerStore}
								on:selection={onCustomerSelection}
							/>
						</div>
					</label>
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label mt-1 col-span-2">
						<span class="h4">Service Number</span>
						<InputChip on:add={onChipAdd} on:input={inputChipValidation} hidden={true} maxlength={4} size={0} type="text" bind:input={referenceNum} bind:value={listOfRefNums} name="chips" placeholder={"0000"}/>
					</label>
					<label class="label mt-1 mr-5 col-span-2">
						<span class="h4">Dropoff Date</span>
						<input class="input" type="date" bind:value={dropOffDate}/>
					</label>
					<label class="label mt-1 col-span-2 row-span-2">
						<span class="h4">Notes: </span>
						<textarea bind:value={notes} class="textarea" rows="4" placeholder="Notes for the order" />
					</label>
					<label class="label mt-1 mr-5 flex flex-col col-span-1">
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
					<div class="mt-1 grid grid-cols-2 col-span-1">
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
			<button disabled={!(referenceNum || (listOfRefNums.length > 0)) || !customerSelection || !dropOffDate} on:click={addNewService} type="button" class="btn mt-2 variant-filled">
				<span>Add</span>
			</button>
		</div>
	</div>
</div>
<Toast />
