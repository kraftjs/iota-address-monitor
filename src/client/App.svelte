<script lang="ts">
    import { onMount } from 'svelte';

    enum NetworkOptions {
        Devnet = 'devnet',
        Mainnet = 'mainnet',
    }

    let network: NetworkOptions = JSON.parse(window.localStorage.getItem('preferredNetwork') || '"devnet"');
    let addresses: Array<string> = [];
    let address = '';

    onMount(() => {
        addresses = JSON.parse(
            window.localStorage.getItem(network === NetworkOptions.Devnet ? 'devnetAddresses' : 'mainnetAddresses') ||
                '[]',
        );
    });

    $: {
        window.localStorage.setItem('preferredNetwork', JSON.stringify(network));
        addresses = JSON.parse(
            window.localStorage.getItem(network === NetworkOptions.Devnet ? 'devnetAddresses' : 'mainnetAddresses') ||
                '[]',
        );
    }

    function handleSubmit() {
        addresses = [...addresses, address];
        window.localStorage.setItem(
            network === NetworkOptions.Devnet ? 'devnetAddresses' : 'mainnetAddresses',
            JSON.stringify(addresses),
        );
        address = '';
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <p>Please select which network to monitor:</p>
    <div>
        <label>
            <input type="radio" bind:group={network} name="network" value={NetworkOptions.Devnet} />
            devnet
        </label>

        <label>
            <input type="radio" bind:group={network} name="network" value={NetworkOptions.Mainnet} />
            mainnet
        </label>
    </div>
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
