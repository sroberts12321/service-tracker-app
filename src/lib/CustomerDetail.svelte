<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

    import { Table, tableMapperValues, type TableSource } from '@skeletonlabs/skeleton';
    import { writeServiceUpdate } from './firebase';

    onMount(async () => {
        console.log('in customer detail: ' + `${JSON.stringify($modalStore[0])}`)
    });

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	const modalStore = getModalStore();
    const customerData = $modalStore[0].meta;

    const tableSimple: TableSource = {
        // A list of heading labels.
        head: ['Reference #', 'Type of Service', 'Drop off Date', 'Paid', 'Picked Up'],
        // The data visibly shown in your table body UI.
        body: tableMapperValues(customerData, ['referenceNum', 'typeOfService', 'dropOffDate', 'paid', 'pickUpDate']),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(customerData, ['serviceId', 'paid', 'pickedUp', 'pickUpDate']),
    };

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

    async function serviceCheckInHandler(meta: unknown) {
        // meta.detail[0] = serviceId string
        // meta.detail[1] = paid boolean
        // meta.detail[2] = pickedUp boolean
        // meta.detail[3] = pickUpDate string

        writeServiceUpdate(meta.detail[0], !meta.detail[1], !meta.detail[2], (new Date().toLocaleDateString('en-us')));
        console.log('on selected: ', meta.detail[0]);
    }

</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
        <div class="max-h-96 overflow-y-scroll">
            <Table source={tableSimple} interactive={true} on:selected={serviceCheckInHandler}/>
        </div>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
    </footer>
	</div>
{/if}