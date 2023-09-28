<script>
	let data = [];
</script>

<svelte:head>
	<title>Checkout</title>
	<meta name="description" content="Checkout Order" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5 mt-10">
		<h1 class="h1">Checkout Order</h1>
		<form id="checkoutForm">
			<label class="label mt-5">
				<span>Last Name</span>
				<input class="input" type="text" placeholder="" />
			</label>
		<button id="checkoutBtn" type="button" class="btn variant-filled mt-5">
			<span>Find</span>
		</button>
	</div>
</div>
