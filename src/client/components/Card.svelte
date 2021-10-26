<script lang="ts">
    export let selected;
    export let bechAddress;
    export let balance: number | Promise<number>;
</script>

<li on:click={() => (selected = bechAddress)} class:selected={bechAddress === selected}>
    {#await balance}
        {bechAddress}...loading
    {:then balanceValue}
        {bechAddress}{balanceValue}
    {:catch error}
        {bechAddress}{error.message}
    {/await}
</li>

<style>
    .selected {
        background-color: bisque;
    }
</style>
