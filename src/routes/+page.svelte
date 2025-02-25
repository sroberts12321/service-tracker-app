<script lang="ts">
	import { onMount } from 'svelte';
	import { notifications } from '$lib/stores/notifications';
	import { createSearchStore } from '$lib/stores/search';
	import {
		deleteServices,
		readCustomerDetail,
		readStore,
		writeServiceExpDates
	} from '$lib/firebase';
	import { Timestamp } from 'firebase/firestore';
	import CustomerDetail from '$lib/CustomerDetail.svelte';
	import { fade } from 'svelte/transition';
	import {
		getModalStore,
		type ModalSettings,
		type ModalComponent,
		ProgressRadial
	} from '@skeletonlabs/skeleton';
	import {
		allServices,
		activeServices,
		allCustomers,
		customerInfo
	} from '$lib/stores/customer-store';
	import { Customer } from '$lib/customer';
	import { Service } from '$lib/service';
	import Toast from '$lib/Toast.svelte';

	let customerStore: Customer[] = [];
	customerStore = $allCustomers;
	allCustomers.subscribe((newStore) => (customerStore = newStore));
	let loading = false;

	onMount(async () => {
		if (customerStore.length > 0) {
			console.log('Data not updated');
		} else {
			loading = true;
			console.log('Fetching Data');
			const res = await readStore('customers')
				.then((returnedCustomers) => {
					customerStore = [];
					allCustomers.set([]);
					returnedCustomers.forEach((doc: any) => {
						let lastName = doc.get('lastName');
						let firstName = doc.get('firstName');
						let label = '';
						if (firstName.length > 0) {
							label = `${lastName}, ${firstName}`;
						} else {
							label = lastName;
						}
						let customer = new Customer(
							doc.id,
							doc.get('documentId'),
							lastName,
							firstName,
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
			console.log('Customer Fetching Successful');
			customerStore = $allCustomers;
			loading = false;
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
	}

	function modalComponentForm(settings: ModalSettings): void {
		modalStore.trigger(settings);
	}

	function sortServiceDates(services: Service[]): Service[] {
		return services.sort((a: Service, b: Service) => {
			const [monthA, dayA, yearA] = a.dropOffDate.split('/');
			const [monthB, dayB, yearB] = b.dropOffDate.split('/');

			const dateA: Date = new Date(`${yearA}-${monthA}-${dayA}`);
			const dateB: Date = new Date(`${yearB}-${monthB}-${dayB}`);

			return dateB.getTime() - dateA.getTime();
		});
	}

	function updateServiceExpDates(services: Service[]): void {
		const today = new Date();
		let servicesToUpdate: Service[] = [];
		let servicesToDelete: string[] = [];
		services.forEach((service) => {
			if (service.expirationDate === undefined) {
				const [monthA, dayA, yearA] = service.dropOffDate.split('/');
				const dateA: Date = new Date(`${yearA}-${monthA}-${dayA}`);
				// Expiration date is set for 2 years after drop off date
				dateA.setFullYear(dateA.getFullYear() + 2);
				service.expirationDate = Timestamp.fromDate(dateA);
				servicesToUpdate.push(service);
			}
			if (service.expirationDate.toDate() < today) {
				servicesToDelete.push(service.serviceId);
			}
		});
		if (servicesToUpdate.length > 0) {
			writeServiceExpDates(servicesToUpdate);
		}
		if (servicesToDelete.length > 0) {
			deleteServices(servicesToDelete);
		}
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
					let service: Service = {
						customerId: customerObject.id,
						serviceId: doc.id,
						dropOffDate: doc.get('dropOffDate'),
						paid: doc.get('paid'),
						pickedUp: doc.get('pickedUp'),
						pickUpDate: doc.get('pickUpDate'),
						isReady: doc.get('isReady'),
						referenceNum: doc.get('referenceNum'),
						typeOfService: doc.get('typeOfService'),
						notes: doc.get('notes'),
						expirationDate: doc.get('expirationDate')
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
				// Checks for expiration dates and adds them if necessary deletes if service is past the date
				updateServiceExpDates(customerServiceObject.allServices);

				allServices.update((services) => sortServiceDates(services));
				activeServices.update((services) => sortServiceDates(services));

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
				modalComponentForm(settings);
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
{#if loading}
	<div
		in:fade={{ duration: 300 }}
		class="container h-full mx-auto flex flex-col justify-center items-center"
	>
		<h1 class="text-primary-500 h2 p-5">Loading Data...</h1>
		<ProgressRadial class="p-5" />
	</div>
{:else}
	<div in:fade={{ duration: 300 }}>
		<div class="container h-full mx-auto flex justify-center items-center">
			<div>
				<h3 class="h2 text-primary-500">Find Customer</h3>
				<form id="searchForm">
					<label class="label mt-1">
						<input
							class="input"
							type="text"
							placeholder="Search..."
							value={$searchStore.search}
							on:input={(e) => searchStore.setSearch(e.currentTarget.value)}
						/>
					</label>
				</form>
			</div>
		</div>
		<div class="container h-full mx-auto flex justify-center items-center">
			<div class="w-4/5 place-content-center auto-cols-auto flex-row grid-cols-3 grid">
				{#if $searchStore.filtered.length < 1}
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
									on:click={() => handleCustomerSelect(customer)}
									class="btn btn-sm variant-filled-tertiary h">SELECT</button
								>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}
<Toast />
