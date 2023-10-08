<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

    import { Table, tableMapperValues, type TableSource } from '@skeletonlabs/skeleton';
    // import { writeServiceUpdate } from './firebase';
	import { getModalStore, type ModalSettings, type ModalComponent} from '@skeletonlabs/skeleton';
    import EditService from './EditService.svelte';

    onMount(async () => {
        console.log('in customer detail: ' + `${JSON.stringify($modalStore[0])}`)
    });

	// Stores
	import { onMount } from 'svelte';
	const modalStore = getModalStore();
    const customerData = $modalStore[0].meta;

	let customerDetailStore: any = [];


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
        meta: tableMapperValues(customerData, ['serviceId', 'paid', 'pickedUp', 'pickUpDate']),
    };

	function handleServiceUpdate(isUpdate: any) {
		console.log(isUpdate + " :update response");
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
    const tableHeader = 'sticky top-0';

    async function serviceCheckInHandler(meta: unknown) {
		const serviceDetail = {
			serviceId: meta.detail[0],
			paid: meta.detail[1],
			pickedUp: meta.detail[2],
			pickUpDate: meta.detail[3]
		}
			const s: ModalComponent = { ref: EditService };
			const settings: ModalSettings = {
				type: 'component',
				component: s,
				title: `Deal with the data later`,
				body: `Edit service`,
				meta: serviceDetail,
				buttonTextCancel: 'Close',
				response: (r) => console.log('response:', r)
			};
			modalComponentForm(settings, s);
        // meta.detail[0] = serviceId string
        // meta.detail[1] = paid boolean
        // meta.detail[2] = pickedUp boolean
        // meta.detail[3] = pickUpDate string

        // need to refactor this into another modal or maybe a dialogue
        // writeServiceUpdate(meta.detail[0], !meta.detail[1], !meta.detail[2], (new Date()).toJSON().slice(0, 10));
        console.log('on selected: ', meta.detail[0]);
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