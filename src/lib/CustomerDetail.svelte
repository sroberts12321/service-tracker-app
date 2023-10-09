<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

    import { Table, tableMapperValues, type TableSource } from '@skeletonlabs/skeleton';
    // import { writeServiceUpdate } from './firebase';
	import { getModalStore, type ModalSettings, type ModalComponent} from '@skeletonlabs/skeleton';
    import EditService from './EditService.svelte';

	// Stores
	import { onMount } from 'svelte';
	const modalStore = getModalStore();
    const customerData = $modalStore[0].meta;

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.trigger(settings);
		modalStore.close();
	}



    const tableSimple: TableSource = {
        // A list of heading labels.
        head: ['Service #', 'Type of Service', 'Drop off Date', 'Paid', 'Picked Up'],
        // The data visibly shown in your table body UI.
        body: tableMapperValues(customerData, ['referenceNum', 'typeOfService', 'dropOffDate', 'paid', 'pickUpDate']),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(customerData, ['serviceId', 'paid', 'pickedUp', 'pickUpDate', 'referenceNum', 'notes']),
    };

	// Base Classes
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

</script>

<!-- @component creates a modal with a table of services for given customer object. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
        <div class="max-h-96 overflow-y-scroll">
            <Table regionHead={tableHeader} source={tableSimple} interactive={true} on:selected={serviceCheckInHandler}/>
        </div>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
    </footer>
	</div>
{/if}