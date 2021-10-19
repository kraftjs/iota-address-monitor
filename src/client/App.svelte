<script lang="ts">
    import { onMount } from 'svelte';

    let addresses: Array<string> = [];
    let address = '';

    onMount(() => {
        addresses = JSON.parse(window.localStorage.getItem('storedAddresses') || '[]');
    });

    function handleSubmit() {
        addresses = [...addresses, address];
        window.localStorage.setItem('storedAddresses', JSON.stringify(addresses));
        address = '';
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <input type="text" placeholder="Enter address" bind:value={address} />
    <button type="submit">Add</button>
</form>
<ul>
    {#each addresses as address}
        <li>{address}</li>
    {/each}
</ul>

<style>
    input {
        padding: 0.25em 0.5em;
    }

    button {
        padding: 0.25em 0.5em;
    }
</style>
