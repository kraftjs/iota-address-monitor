<script lang="ts">
    import { onMount } from 'svelte';

    import { Bech32Helper } from '@iota/iota.js';

    enum NetworkType {
        Dev = 'devnet',
        Main = 'mainnet',
    }

    enum LocalStorage {
        SavedNetwork = 'selectedNetwork',
        DevAddresses = 'devnetAddresses',
        MainAddresses = 'mainnetAddresses',
    }

    let network: NetworkType = JSON.parse(window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"');
    let addresses: Array<string> = [];
    let address = '';

    onMount(() => {
        addresses = JSON.parse(
            window.localStorage.getItem(
                network === NetworkType.Dev ? LocalStorage.DevAddresses : LocalStorage.MainAddresses,
            ) || '[]',
        );
    });

    $: {
        window.localStorage.setItem(LocalStorage.SavedNetwork, JSON.stringify(network));
        addresses = JSON.parse(
            window.localStorage.getItem(
                network === NetworkType.Dev ? LocalStorage.DevAddresses : LocalStorage.MainAddresses,
            ) || '[]',
        );
    }

    function isValidBech32(address: string): boolean {
        try {
            const humanReadablePart =
                network === NetworkType.Dev
                    ? Bech32Helper.BECH32_DEFAULT_HRP_DEV
                    : Bech32Helper.BECH32_DEFAULT_HRP_MAIN;
            return !!Bech32Helper.fromBech32(address, humanReadablePart);
        } catch (e) {
            return false;
        }
    }

    function handleSubmit() {
        if (isValidBech32(address) && !addresses.includes(address)) {
            addresses = [...addresses, address];
            window.localStorage.setItem(
                network === NetworkType.Dev ? LocalStorage.DevAddresses : LocalStorage.MainAddresses,
                JSON.stringify(addresses),
            );
            address = '';
        }
    }

    function handleDelete(addressToRemove: String) {
        console.log(`handleDelete ${addressToRemove}`);
        addresses = addresses.filter((address) => addressToRemove !== address);
        window.localStorage.setItem(
            network === NetworkType.Dev ? LocalStorage.DevAddresses : LocalStorage.MainAddresses,
            JSON.stringify(addresses),
        );
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <p>Please select which network to monitor:</p>
    <div>
        <label>
            <input type="radio" bind:group={network} name="network" value={NetworkType.Dev} />
            devnet
        </label>

        <label>
            <input type="radio" bind:group={network} name="network" value={NetworkType.Main} />
            mainnet
        </label>
    </div>
    <input type="text" placeholder="Enter address" bind:value={address} />
    <button type="submit">Add</button>
</form>
<ul>
    {#each addresses as address (address)}
        <li><button type="button" on:click={() => handleDelete(address)}>Delete</button>{address}</li>
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
