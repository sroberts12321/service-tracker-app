<script lang="ts">
	export let parent: any;
	import { getModalStore, type ModalSettings, type ModalComponent  } from '@skeletonlabs/skeleton';
	import { writeServiceUpdate } from './firebase';
	import CustomerDetail from './CustomerDetail.svelte';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();
	const customerData = $modalStore[0].meta;

	onMount(async () => {
		// console.log(`${JSON.stringify(customerData.serviceDetail)} : customer`)
	})

    const serviceDetail = {
        serviceId: customerData.serviceDetail.serviceId,
        paid: customerData.serviceDetail.paid,
        pickedUp: customerData.serviceDetail.pickedUp,
		pickUpDate: (new Date()).toJSON().slice(0, 10),
		referenceNum: customerData.serviceDetail.referenceNum,
		notes: customerData.serviceDetail.notes 
    }

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.trigger(settings);
		modalStore.close();
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
		writeServiceUpdate(serviceDetail.serviceId, serviceDetail.paid, serviceDetail.pickedUp, serviceDetail.pickUpDate).then((returnedInfo) => {
			JSON.stringify(returnedInfo);
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
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
                <button class="btn {parent.buttonPositive}" on:click={editService}>Submit Change</button>
    </footer>
	</div>
{/if}
