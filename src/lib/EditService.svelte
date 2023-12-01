<script lang="ts">
	export let parent: any;
	import { getModalStore, type ModalSettings, type ModalComponent  } from '@skeletonlabs/skeleton';
	import { writeServiceUpdate } from './firebase';
	import CustomerDetail from './CustomerDetail.svelte';
	import { activeServices } from './stores/customer-store';

	const modalStore = getModalStore();
	const customerData = $modalStore[0].meta;

    const serviceDetail = {
        serviceId: customerData.serviceDetail.serviceId,
        paid: customerData.serviceDetail.paid,
        pickedUp: customerData.serviceDetail.pickedUp,
		pickUpDate: convertDate((new Date()).toLocaleDateString(), "initial"),
		referenceNum: customerData.serviceDetail.referenceNum,
		notes: customerData.serviceDetail.notes 
    }

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.trigger(settings);
		modalStore.close();
	}

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

	async function handleReturnToCustomerDetail(meta: unknown) {
		const c: ModalComponent = { ref: CustomerDetail };
			const settings: ModalSettings = {
				type: 'component',
				component: c,
				title: `${customerData.customerInfo.firstName} ${customerData.customerInfo.lastName}`,
				body: `Account Notes: \n${customerData.customerInfo.notes}`,
				meta: customerData,
				buttonTextCancel: 'Close',
				response: (r) => console.log('response:', r)
			};
			modalComponentForm(settings, c);
		}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
    const tableHeader = 'sticky top-0';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token'; 

	async function editService() {
		writeServiceUpdate(serviceDetail.serviceId, serviceDetail.paid, serviceDetail.pickedUp, convertDate(serviceDetail.pickUpDate, "database"))
		.then((returnedInfo) => {
			activeServices.update(services => services.filter((service) => service.serviceId  !== serviceDetail.serviceId));
			handleReturnToCustomerDetail(customerData);
		}).catch((err) => {
			console.error(err);
		});
	}
</script>

<!-- @component creates a modal with a way of editing a given service. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
       <form class="modal-form {cForm}">
			<div class="grid grid-cols-2 col-span-1">
				<p class="col-span-2">
					<span class="h4">Order Status</span>
				</p>
				<label class="flex items-center space-x-2">
					<input bind:checked={serviceDetail.paid} class="checkbox" type="checkbox" />
					<p>Paid</p>
				</label>
				<label class="label">
					<span>Picked Up</span>
					<input class="checkbox" type="checkbox" bind:checked={serviceDetail.pickedUp} placeholder="Enter phone..." />
				</label>
			</div>
			<label class="label">
				<span>Pick Up Date</span>
				<input class="input" type="date" bind:value={serviceDetail.pickUpDate} placeholder="Enter email address..." />
			</label>
		</form> 
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={handleReturnToCustomerDetail}>Back</button>
                <button class="btn {parent.buttonPositive}" on:click={editService}>Submit Change</button>
    </footer>
	</div>
{/if}
