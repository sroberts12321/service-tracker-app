<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { notifications } from '$lib/stores/notifications';
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { readCustomerDetail, readStore } from '$lib/firebase';
	import CustomerDetail from '$lib/CustomerDetail.svelte';
	import { getModalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import {
		allServices,
		activeServices,
		allCustomers,
		customerInfo
	} from '$lib/stores/customer-store';
	import { Customer } from '$lib/customer';
	import Toast from '$lib/Toast.svelte';

	let customerStore: Customer[] = [];
	customerStore = $allCustomers;
	allCustomers.subscribe((newStore) => (customerStore = newStore));

	onMount(async () => {
		if (customerStore.length > 0) {
			console.log('Data not updated');
		} else {
			console.log('Fetching Data');
			const res = await readStore('customers')
				.then((returnedCustomers) => {
					customerStore = [];
					allCustomers.set([]);
					returnedCustomers.forEach((doc) => {
						let label = '';
						if (doc.get('firstName').length > 0) {
							label = `${doc.get('lastName')}, ${doc.get('firstName')}`;
						} else {
							label = doc.get('lastName');
						}
						let customer = new Customer(
							doc.id,
							doc.get('documentId'),
							doc.get('lastName'),
							doc.get('firstName'),
							doc.get('nickname'),
							doc.get('phone'),
							doc.get('email'),
							doc.get('balance'),
							doc.get('notes'),
							doc.get('searchTerms'),
							label
						);
						if (customer.notes === undefined) {
							customer.notes = ' ';
						}
						allCustomers.update((customers) => [...customers, customer]);
					});
				})
				.catch((err) => {
					console.error(err);
					notifications.danger('Error Getting Customer Data', 3000);
				});
			console.log('customer fetching successful');
			customerStore = $allCustomers;
			return customerStore;
		}
	});

	const modalStore = getModalStore();
	let customerServiceObject: any = {
		allServices: [],
		activeServices: []
	};

	let searchStore = createSearchStore([]);

	$: if (customerStore.length > 0) {
		const searchCustomers = customerStore.map((customer) => ({
			...customer,
			searchTerms: `${customer.lastName} ${customer.firstName} ${customer.email} ${customer.nickname} ${customer.phone} *`
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
				customerServiceObject = {
					allServices: [],
					activeServices: [],
					customerInfo: customerObject
				};
				customerInfo.set(customerObject);
				returnedServices.forEach((doc: any) => {
					let service: any = {
						serviceId: doc.id,
						dropOffDate: doc.get('dropOffDate'),
						paid: doc.get('paid'),
						pickUpDate: doc.get('pickUpDate'),
						pickedUp: doc.get('pickedUp'),
						referenceNum: doc.get('referenceNum'),
						typeOfService: doc.get('typeOfService'),
						notes: doc.get('notes')
					};
					if (service.pickedUp === false) {
						activeServices.update((services) => [...services, service]);
						customerServiceObject.activeServices = [
							...customerServiceObject.activeServices,
							service
						];
					}
					allServices.update((services) => [...services, service]);
					customerServiceObject.allServices = [...customerServiceObject.allServices, service];
				});
				const c: ModalComponent = { ref: CustomerDetail };
				const settings: ModalSettings = {
					type: 'component',
					component: c,
					title: `${customerObject.label}`,
					body: `Account Notes:\n${customerObject.notes}`,
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
				<input bind:value={$searchStore.search} class="input" type="text" placeholder="Search..." />
			</label>
		</form>
	</div>
</div>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="w-4/5 place-content-center auto-cols-auto flex-row grid-cols-3 grid">
		{#if $searchStore.search.length < 1}
			<div class="" />
		{:else}
			{#each $searchStore.filtered as customer}
				<div class="card card-hover p-4 text-center m-5 grid content-between">
					<div class="m-1">
						<h3 class="h3">{customer.label}</h3>
					</div>
					{#if customer.nickname != undefined && customer.nickname != ''}
						<div class="m1">
							<p>({customer.nickname})</p>
						</div>
					{/if}
					<div class="m-1">
						<button
							on:click={handleCustomerSelect(customer)}
							class="btn btn-sm variant-filled-tertiary h">SELECT</button
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
<Toast />
