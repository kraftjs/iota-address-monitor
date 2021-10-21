<script lang="ts">
    import { onMount } from 'svelte';

    import { Bech32Helper } from '@iota/iota.js';

    enum NetworkOptions {
        Devnet = 'devnet',
        Mainnet = 'mainnet',
    }

    enum StorageKeys {
        Network = 'preferredNetwork',
        DevnetAddresses = 'devnetAddresses',
        MainnetAddresses = 'mainnetAddresses',
    }

    let network: NetworkOptions = JSON.parse(window.localStorage.getItem(StorageKeys.Network) || '"devnet"');
    let addresses: Array<string> = [];
    let address = '';

    onMount(() => {
        addresses = JSON.parse(
            window.localStorage.getItem(
                network === NetworkOptions.Devnet ? StorageKeys.DevnetAddresses : StorageKeys.MainnetAddresses,
            ) || '[]',
        );
    });

    $: {
        window.localStorage.setItem(StorageKeys.Network, JSON.stringify(network));
        addresses = JSON.parse(
            window.localStorage.getItem(
                network === NetworkOptions.Devnet ? StorageKeys.DevnetAddresses : StorageKeys.MainnetAddresses,
            ) || '[]',
        );
    }

    function isValidBech32(address: string): boolean {
        try {
            const humanReadablePart =
                network === NetworkOptions.Devnet
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
                network === NetworkOptions.Devnet ? StorageKeys.DevnetAddresses : StorageKeys.MainnetAddresses,
                JSON.stringify(addresses),
            );
            address = '';
        }
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
