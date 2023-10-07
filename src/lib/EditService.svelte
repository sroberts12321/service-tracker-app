<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

    import { writeServiceUpdate } from './firebase';

    onMount(async () => {
        console.log('in customer detail: ' + `${JSON.stringify($modalStore[1])}`)
    });

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	const modalStore = getModalStore();
    const customerData = $modalStore[1].meta;

    const formData = {
        name: 'John Doe',
        tel: '555-555-1234',
        email: 'jdoe@gmail.com'
    }

    function onFormSubmit(): void {
        if($modalStore[1].response) $modalStore[1].response(formData);
        modalStore.close();
    }

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
    const tableHeader = 'sticky top-0';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token'; 

</script>

<!-- @component creates a modal with a way of editing a given service. -->

{#if $modalStore[1]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[1].title ?? '(title missing)'}</header>
		<article>{$modalStore[1].body ?? '(body missing)'}</article>
       <form class="modal-form {cForm}">
			<label class="label">
				<span>Name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<label class="label">
				<span>Phone Number</span>
				<input class="input" type="tel" bind:value={formData.tel} placeholder="Enter phone..." />
			</label>
			<label class="label">
				<span>Email</span>
				<input class="input" type="email" bind:value={formData.email} placeholder="Enter email address..." />
			</label>
		</form> 
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
                <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Change</button>
    </footer>
	</div>
{/if}
