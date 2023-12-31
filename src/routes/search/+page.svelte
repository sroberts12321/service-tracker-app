<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { notifications } from '$lib/stores/notifications';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { readCustomerDetail, readStore } from '$lib/firebase';
	import CustomerDetail from '$lib/CustomerDetail.svelte';
	import { getModalStore, type ModalSettings, type ModalComponent} from '@skeletonlabs/skeleton';
	import { customerAutoSelectOptions, allServices, activeServices, allCustomers, customerInfo } from '$lib/stores/customer-store';
	import type { Customer } from '$lib/customer';
	import Toast from "$lib/Toast.svelte";

	let customerStore: any = [];
	customerStore = $allCustomers;
	allCustomers.subscribe((newStore) => customerStore = newStore);

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
	}	
	let customerSelectLabel = '';
	let customerSelectValue = '';
	let customerSelectKeywords = '';;
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
						label: doc.get('lastName') + ", " + doc.get('firstName')
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
			customerStore = $allCustomers;
			return customerStore;
		}
	})

	const initialCustomerInfoState: Customer = {
		id: '',
		documentId: '',
		lastName: '',
		firstName: '',
		nickname: '',
		phone: '',
		email: '',
		balance: 0,
		notes: '',
		searchTerms: '',
		label: ''
	}

	const modalStore = getModalStore();
	let customerServiceObject: any = {
		"allServices": [],
		"activeServices": []
	};

	let searchStore = createSearchStore([]);

	$: if (customerStore.length > 0) {
		const searchCustomers = customerStore.map((customer) => ({
			...customer,
			searchTerms: `${customer.lastName} ${customer.firstName} ${customer.email} ${customer.nickname}`
		}));
		searchStore = createSearchStore(searchCustomers);
		const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

		onDestroy(() => {
			unsubscribe();
		});
	}


	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.trigger(settings);
	}

	async function handleCustomerSelect(customerObject: Customer) {
		const res = await readCustomerDetail(customerObject.id)
		.then((returnedServices) => {
			activeServices.set([]);
			allServices.set([]);
			customerInfo.set(initialCustomerInfoState);
			customerServiceObject = {
					"allServices": [],
					"activeServices": [],
					"customerInfo": customerObject
				};
			customerInfo.set(customerObject);
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
				if (service.pickedUp === false) {
					activeServices.update(services => [...services, service]);
					customerServiceObject.activeServices = [...customerServiceObject.activeServices, service]
				}
					allServices.update(services => [...services, service]);
					customerServiceObject.allServices = [...customerServiceObject.allServices, service]
			});
			const c: ModalComponent = { ref: CustomerDetail };
			const settings: ModalSettings = {
				type: 'component',
				component: c,
				title: `${customerObject.lastName}, ${customerObject.firstName}`,
				body: `Account Notes: \n${customerObject.notes}`,
				meta: customerServiceObject,
				buttonTextCancel: 'Close',
				response: (r) => console.log('response:', r)
			};
			modalComponentForm(settings, c);
		})
		.catch((err) => {
			console.error(err);
		});
	}
</script>

<svelte:head>
	<title>Search</title>
	<meta name="description" content="Find Customer" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div>
		<h3 class="h2 text-primary-500">Find Customer</h3>
		<form id="searchForm">
			<label class="label mt-1">
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
				{#if customer.nickname != undefined && customer.nickname != ''}
				<div class="m1">
					<p>({customer.nickname})</p>
				</div>
				{/if}
				<div class="m-1">
					<button on:click={handleCustomerSelect(customer)} class="btn btn-sm variant-filled-tertiary h">SELECT</button>
				</div>
			</div>
			{/each}
		{/if}
	</div>
</div>
<Toast />
