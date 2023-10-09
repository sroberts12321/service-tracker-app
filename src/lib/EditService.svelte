<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { writeServiceUpdate } from './firebase';
	const modalStore = getModalStore();
	const serviceData = $modalStore[0].meta;

    const serviceDetail = {
        serviceId: serviceData.serviceId,
        paid: serviceData.paid,
        pickedUp: serviceData.pickedUp,
		pickUpDate: (new Date()).toJSON().slice(0, 10),
		referenceNum: serviceData.referenceNum,
		notes: serviceData.notes
    }

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
    const tableHeader = 'sticky top-0';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token'; 

	async function editService() {
		writeServiceUpdate(serviceDetail.serviceId, serviceDetail.paid, serviceDetail.pickedUp, serviceDetail.pickUpDate).then((returnedInfo) => {
			JSON.stringify(returnedInfo);
		}).catch((err) => {
			console.error(err);
		}).finally(() => {modalStore.close()});
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
