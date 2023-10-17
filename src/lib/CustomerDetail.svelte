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

	// Stores
	const modalStore = getModalStore();
    const customerData = $modalStore[0].meta;
	let isAllServices = false;

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.trigger(settings);
		modalStore.close();
	}

    const allServicesTableData: TableSource = {
        head: ['Service #', 'Type of Service', 'Drop off Date', 'Paid', 'Picked Up'],
        body: tableMapperValues(customerData.allServices, ['referenceNum', 'typeOfService', 'dropOffDate', 'paid', 'pickUpDate']),
        meta: tableMapperValues(customerData.allServices, ['serviceId', 'paid', 'pickedUp', 'pickUpDate', 'referenceNum', 'notes']),
    };

    const activeServicesTableData: TableSource = {
        head: ['Service #', 'Type of Service', 'Drop off Date', 'Paid', 'Picked Up'],
        body: tableMapperValues(customerData.activeServices, ['referenceNum', 'typeOfService', 'dropOffDate', 'paid', 'pickUpDate']),
        meta: tableMapperValues(customerData.activeServices, ['serviceId', 'paid', 'pickedUp', 'pickUpDate', 'referenceNum', 'notes']),
    };

	$: tableData = isAllServices ? allServicesTableData : activeServicesTableData;

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
    const tableHeader = 'sticky top-0';

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
			const s: ModalComponent = { ref: EditService };
			const settings: ModalSettings = {
				type: 'component',
				component: s,
				title: `Order #${meta.detail[4]}`,
				body: `Order Notes: \n ${meta.detail[5]}`,
				meta: serviceDetail,
				buttonTextCancel: 'Close',
				response: (r) => console.log('response:', r)
			};
			modalComponentForm(settings, s);
    }

	async function handleEditCustomer(meta: unknown) {
		const customerInfo = {
			customerId: customerData.customerInfo.id,
			lastName: customerData.customerInfo.lastName,
			firstName: customerData.customerInfo.firstName,
			phone: customerData.customerInfo.phone,
			email: customerData.customerInfo.email,
			balance: customerData.customerInfo.balance,
			notes: customerData.customerInfo.notes,
			nickname: customerData.customerInfo.nickname
		}
			const s: ModalComponent = { ref: EditCustomer };
			const settings: ModalSettings = {
				type: 'component',
				component: s,
				title: `Customer Info`,
				body: `Customer Notes:`,
				meta: customerInfo,
				buttonTextCancel: 'Close',
				response: (r) => console.log('response:', r)
			};
			modalComponentForm(settings, s);
	}

</script>

<!-- @component creates a modal with a table of services for given customer object. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
			<button class="btn {parent.buttonNeutral}" on:click={handleEditCustomer}>Edit</button>
        <div class="max-h-96 overflow-y-scroll">
            <Table regionHead={tableHeader} source={tableData} interactive={true} on:selected={serviceCheckInHandler}/>
        </div>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<SlideToggle name="slider-label" class="w-48" bind:checked={isAllServices}>{isAllServices ? 'All Services' : 'Not Picked Up'}</SlideToggle>
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		</footer>
	</div>
{/if}