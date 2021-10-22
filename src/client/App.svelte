<script lang="ts">
    import { onMount } from 'svelte';

    import { isValidBech32, retrieveBalances } from './lib/utils';
    import { Address, LocalStorage, NetworkType } from './lib/typings';

    let currentNetwork: NetworkType = JSON.parse(window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"');
    let currentStorageKey: LocalStorage.DevAddresses | LocalStorage.MainAddresses;
    let addresses: Array<string> = [];
    let addressObjectList: Array<Address> = [];
    let address = '';

    onMount(async () => {
        addresses = JSON.parse(window.localStorage.getItem(currentStorageKey) || '[]');
        addressObjectList = await retrieveBalances(addresses, currentNetwork);
    });

    $: {
        window.localStorage.setItem(LocalStorage.SavedNetwork, JSON.stringify(currentNetwork));
        currentStorageKey = currentNetwork === NetworkType.Dev ? LocalStorage.DevAddresses : LocalStorage.MainAddresses;
        addresses = JSON.parse(window.localStorage.getItem(currentStorageKey) || '[]');
    }

    $: (async () => (addressObjectList = await retrieveBalances(addresses, currentNetwork)))();

    function handleSubmit() {
        if (isValidBech32(address, currentNetwork) && !addresses.includes(address)) {
            addresses = [...addresses, address];
            window.localStorage.setItem(currentStorageKey, JSON.stringify(addresses));
            address = '';
        }
    }

    function handleDelete(addressToRemove: String) {
        console.log(`handleDelete ${addressToRemove}`);
        addresses = addresses.filter((address) => addressToRemove !== address);
        window.localStorage.setItem(currentStorageKey, JSON.stringify(addresses));
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <p>Please select which network to monitor:</p>
    <div>
        <label>
            <input type="radio" bind:group={currentNetwork} name="network" value={NetworkType.Dev} />
            devnet
        </label>

        <label>
            <input type="radio" bind:group={currentNetwork} name="network" value={NetworkType.Main} />
            mainnet
        </label>
    </div>
    <input type="text" placeholder="Enter address" bind:value={address} />
    <button type="submit">Add</button>
</form>
<ul>
    {#each addressObjectList as { address, balance } (address)}
        <li><button type="button" on:click={() => handleDelete(address)}>Delete</button>{address}{balance}</li>
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
