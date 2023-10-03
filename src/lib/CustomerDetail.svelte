<script lang="ts">
    export let listOfServices: any = [];
</script>

<div>
    {#each listOfServices as service}
    <div>
        <h3 class="h3">{service.referenceNum}</h3>
        <p>{service.dropOffDate}</p>
    </div>
    {/each}
</div>