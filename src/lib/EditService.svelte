<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

    // import { writeServiceUpdate } from './firebase';

    onMount(async () => {
        console.log('in customer detail: ' + `${JSON.stringify($modalStore[0])}`)
    });

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	const modalStore = getModalStore();
	const serviceData = $modalStore[0].meta;

    const formData = {
        name: serviceData.serviceId,
        paid: serviceData.paid,
        pickedUp: serviceData.pickedUp,
		pickUpDate: (new Date()).toJSON().slice(0, 10)
    }

    function onFormSubmit(): void {
        if($modalStore[0].response) $modalStore[0].response(formData);
        modalStore.close();
    }

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
    const tableHeader = 'sticky top-0';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token'; 

</script>

<!-- @component creates a modal with a way of editing a given service. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
       <form class="modal-form {cForm}">
			<label class="label">
				<span>Name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<div class="mt-5 grid grid-cols-2 col-span-1">
				<p class="col-span-2">
					<span class="h4">Order Status</span>
				</p>
				<label class="flex items-center space-x-2">
					<input bind:value={formData.paid} class="checkbox" type="checkbox" />
					<p>Paid</p>
				</label>
				<label class="label">
					<span>Picked Up</span>
					<input class="checkbox" type="checkbox" bind:value={formData.pickedUp} placeholder="Enter phone..." />
				</label>
			</div>
			<label class="label">
				<span>Pick Up Date</span>
				<input class="input" type="date" bind:value={formData.pickUpDate} placeholder="Enter email address..." />
			</label>
		</form> 
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
                <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Change</button>
    </footer>
	</div>
{/if}
