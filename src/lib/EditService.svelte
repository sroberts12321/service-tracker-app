<script lang="ts">
	export let parent: any;
	import { getModalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import { writeServiceUpdate, deleteService } from './firebase';
	import CustomerDetail from './CustomerDetail.svelte';
	import { activeServices } from './stores/customer-store';

	const modalStore = getModalStore();
	const customerData = $modalStore[0].meta;

	const serviceDetail = {
		serviceId: customerData.serviceDetail.serviceId,
		paid: customerData.serviceDetail.paid,
		pickedUp: customerData.serviceDetail.pickedUp,
		pickUpDate: convertDate(new Date().toLocaleDateString(), 'initial'),
		referenceNum: customerData.serviceDetail.referenceNum,
		notes: customerData.serviceDetail.notes
	};

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

		if (dateType === 'initial') {
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

		if (dateType === 'initial') {
			newDate = `${year}-${month}-${day}`;
		} else {
			newDate = `${month}/${day}/${year}`;
		}

		return newDate;
	}
	const confirmModal: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you want to delete this service?',
		response: (r: boolean) => {
			if (r) {
				deleteService(serviceDetail.serviceId);
				activeServices.update((services) =>
					services.filter((service) => service.serviceId !== serviceDetail.serviceId)
				);
			}
		}
	};

	function confirmDelete() {
		modalStore.close();
		modalStore.trigger(confirmModal);
	}

	function payAndPickUp() {
		serviceDetail.pickedUp = true;
		serviceDetail.paid = true;
		editService();
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
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	async function editService() {
		let dbConvertedDate = '';
		if (serviceDetail.pickedUp) {
			dbConvertedDate = convertDate(serviceDetail.pickUpDate, 'database');
		} else {
			serviceDetail.pickUpDate = '';
		}
		writeServiceUpdate(
			serviceDetail.serviceId,
			serviceDetail.paid,
			serviceDetail.pickedUp,
			dbConvertedDate,
			serviceDetail.notes
		)
			.then((returnedInfo) => {
				modalStore.close();
			})
			.catch((err) => {
				console.error(err);
			});
	}
</script>

<!-- @component creates a modal with a way of editing a given service. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{`Order #${serviceDetail.referenceNum}`}</header>
		<article>{`Order Notes: ${serviceDetail.notes}`}</article>
		<form class="modal-form {cForm}">
			<div class="grid grid-cols-2 col-span-1">
				<div class="col-span-1 flex items-center justify-center pt-4 pr-4">
					<button
						class="btn-xl variant-filled-tertiary"
						on:click={payAndPickUp}
						disabled={serviceDetail.pickedUp}
					>
						Check Out
					</button>
				</div>
				<div class="col-span-1">
					<p class="col-span-2">
						<span class="h4">Order Notes</span>
					</p>
					<textarea
						class="textarea"
						rows="2"
						placeholder="Order Notes"
						autocomplete="off"
						bind:value={serviceDetail.notes}
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 col-span-1">
				<div class="grid grid-cols-2 col-span-1">
					<p class="col-span-2">
						<span class="h4">Order Status</span>
					</p>
					<label class="flex items-center space-x-2">
						<input bind:checked={serviceDetail.paid} class="checkbox" type="checkbox" />
						<p>Paid</p>
					</label>
					<label class="label">
						<input class="checkbox" type="checkbox" bind:checked={serviceDetail.pickedUp} />
						<span>Picked Up</span>
					</label>
				</div>
				<label class="label">
					<span class="h4">Pick Up Date</span>
					<input class="input" type="date" bind:value={serviceDetail.pickUpDate} />
				</label>
			</div>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter} flex justify-between">
			<button class="btn variant-filled-error" type="button" on:click={confirmDelete}>Delete</button>
			<div>
				<button class="btn {parent.buttonNeutral}" on:click={handleReturnToCustomerDetail}>Back</button>
                <button class="btn {parent.buttonPositive}" on:click={editService}>Submit Change</button>
			</div>
		</footer>
	</div>
{/if}
