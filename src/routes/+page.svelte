<script>
	
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5 mt-10">
		<h1 class="h1">ADD SERVICE ORDER</h1>
		<form id="orderForm">
			<label class="label mt-5">
				<span>Reference Number</span>
				<input class="input" type="text" placeholder="0000" />
			</label>
			<label class="label mt-5">
				<span>Dropoff Date</span>
				<input class="input" type="text" placeholder="" />
			</label>
			<label class="label mt-5">
				<span>Type of Service</span>
				<select class="select">
					<option value="1">Cleaning</option>
					<option value="2">Alterations</option>
				</select>
			</label>
			<div class="space-y-2 mt-5">
				<label class="flex items-center space-x-2">
					<input class="checkbox" type="checkbox" />
					<p>Paid</p>
				</label>
				<label class="flex items-center space-x-2">
					<input class="checkbox" type="checkbox" />
					<p>Picked up</p>
				</label>
			</div>
			<label class="label mt-5">
				<span>Pickup Date</span>
				<input class="input" type="date" placeholder="" />
			</label>
			<label class="label mt-5">
				<span>Notes: </span>
				<textarea class="textarea" rows="4" placeholder="Notes for the order" />
			</label>
		</form>
		<button type="button" class="btn variant-filled">
			<span>Add</span>
		</button>
	</div>
</div>
