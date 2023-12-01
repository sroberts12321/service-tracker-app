<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

    import { 
		Table, 
		tableMapperValues, 
		getModalStore, 
		SlideToggle,
		type TableSource, 
		type ModalSettings, 
		type ModalComponent 
	} from '@skeletonlabs/skeleton';

    import EditService from './EditService.svelte';
    import EditCustomer from './EditCustomer.svelte';
	import AddServiceComponent from './AddServiceComponent.svelte';
	import { allServices, activeServices, customerInfo } from './stores/customer-store';
	import type { Customer } from './customer';
	import { onMount } from 'svelte';
	import Toast from "$lib/Toast.svelte";

	// Stores
	const modalStore = getModalStore();
	let customerData = $modalStore[0].meta;
	let isAllServices = false;

	let customerDetail: Customer;
	let initialState: Customer;
	customerInfo.subscribe((data) => {
		customerDetail = data;
	})

	onMount(() => {
		initialState = {
			id: customerDetail.id,
			lastName: customerDetail.lastName, 
			firstName: customerDetail.firstName, 
			nickname: customerDetail.nickname,
			phone: customerDetail.phone, 
			email: customerDetail.email, 
			balance: customerDetail.balance, 
			notes: customerDetail.notes,
			searchTerms: customerDetail.searchTerms
		}
	})	

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.trigger(settings);
		modalStore.close();
	}

    const allServicesTableData: TableSource = {
        head: ['Service #', 'Type of Service', 'Drop off Date', 'Paid', 'Picked Up'],
        body: tableMapperValues($allServices, ['referenceNum', 'typeOfService', 'dropOffDate', 'paid', 'pickUpDate']),
        meta: tableMapperValues($allServices, ['serviceId', 'paid', 'pickedUp', 'pickUpDate', 'referenceNum', 'notes']),
    };

    const activeServicesTableData: TableSource = {
        head: ['Service #', 'Type of Service', 'Drop off Date', 'Paid', 'Picked Up'],
        body: tableMapperValues($activeServices, ['referenceNum', 'typeOfService', 'dropOffDate', 'paid', 'pickUpDate']),
        meta: tableMapperValues($activeServices, ['serviceId', 'paid', 'pickedUp', 'pickUpDate', 'referenceNum', 'notes']),
    };

	$: tableData = isAllServices ? allServicesTableData : activeServicesTableData;

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
    const tableHeader = 'sticky top-0';

	function resetInitialCustomerState() {
		customerInfo.set(initialState);
		customerData.customerInfo.id = initialState.id;
		customerData.customerInfo.lastName = initialState.lastName; 
		customerData.customerInfo.firstName = initialState.firstName;
		customerData.customerInfo.phone = initialState.phone;
		customerData.customerInfo.email = initialState.email;
		customerData.customerInfo.balance = initialState.balance;
		customerData.customerInfo.notes = initialState.notes;
		customerData.customerInfo.nickname = initialState.nickname;
	}

    async function serviceCheckInHandler(meta: unknown) {
		if (meta.detail[5] === undefined) {
			meta.detail[5] = ' ';
		}
		const serviceDetail = {
			serviceId: meta.detail[0],
			paid: meta.detail[1],
			pickedUp: meta.detail[2],
			pickUpDate: meta.detail[3],
			referenceNum: meta.detail[4],
			notes:meta.detail[5]
		}
		customerData = {
			...customerData,
			serviceDetail
		};
			const s: ModalComponent = { ref: EditService };
			const settings: ModalSettings = {
				type: 'component',
				component: s,
				title: `Order #${meta.detail[4]}`,
				body: `Order Notes: \n ${meta.detail[5]}`,
				meta: customerData,
				buttonTextCancel: 'Close',
				response: (r) => console.log('response:', r)
			};
			modalComponentForm(settings, s);
    }

	async function handleEditCustomer() {	
			const s: ModalComponent = { ref: EditCustomer };
			const settings: ModalSettings = {
				type: 'component',
				component: s,
				title: `${customerData.customerInfo.lastName}, ${customerData.customerInfo.firstName}`,
				body: `Customer Notes: ${customerData.customerInfo.notes}`,
				meta: customerData,
				buttonTextCancel: 'Back',
				response: (r: boolean) => {
					if (r) {
						console.log(r + " : response");
					} else {
						resetInitialCustomerState();
					}
				}
			};
			modalComponentForm(settings, s);
	}

	async function handleAddNewService(meta: unknown) {
		const customerInfo = {
			id: customerData.customerInfo.id,
			lastName: customerData.customerInfo.lastName,
			firstName: customerData.customerInfo.firstName
		}
			const s: ModalComponent = { ref: AddServiceComponent };
			const settings: ModalSettings = {
				type: 'component',
				component: s,
				title: `New Service for ${customerData.customerInfo.lastName}, ${customerData.customerInfo.firstName}`,
				body: `Customer Notes: ${customerData.customerInfo.notes}`,
				meta: customerData,
				buttonTextCancel: 'Back',
				response: (r) => console.log('response:', r)
			};
			modalComponentForm(settings, s);
	}
</script>

<!-- @component creates a modal with a table of services for given customer object. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}
			<button class="btn {parent.buttonNeutral}" on:click={handleEditCustomer}>Edit</button>
		</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
        <div class="max-h-96 overflow-y-scroll">
            <Table regionHead={tableHeader} source={tableData} interactive={true} on:selected={serviceCheckInHandler}/>
        </div>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter} flex justify-between">
			<button class="btn btn-sm variant-filled-tertiary" on:click={handleAddNewService}>Add New Service</button>
			<SlideToggle name="slider-label" class="w-48" bind:checked={isAllServices}>{isAllServices ? 'All Services' : 'Not Picked Up'}</SlideToggle>
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		</footer>
	</div>
{/if}
<Toast />