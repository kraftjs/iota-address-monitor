<script lang="ts">
    import { onMount } from 'svelte';

    import { Bech32Helper, SingleNodeClient } from '@iota/iota.js';
    import { Address, LocalStorage, NetworkType, NodeEndpoint } from '../shared/typings';

    let currentNetwork: NetworkType = JSON.parse(window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"');
    let currentStorageKey: LocalStorage.DevAddresses | LocalStorage.MainAddresses;
    let addresses: Array<string> = [];
    let addressObjectList: Array<Address> = [];
    let address = '';
    let client = {
        devnet: new SingleNodeClient(NodeEndpoint.Devnet),
        mainnet: new SingleNodeClient(NodeEndpoint.Mainnet),
    };
    let currentClient: SingleNodeClient;

    onMount(async () => {
        addresses = JSON.parse(window.localStorage.getItem(currentStorageKey) || '[]');
        addressObjectList = await retrieveBalances(addresses, currentClient);
    });

    $: {
        window.localStorage.setItem(LocalStorage.SavedNetwork, JSON.stringify(currentNetwork));
        currentStorageKey = currentNetwork === NetworkType.Dev ? LocalStorage.DevAddresses : LocalStorage.MainAddresses;
        currentClient = currentNetwork === NetworkType.Dev ? client.devnet : client.mainnet;
        addresses = JSON.parse(window.localStorage.getItem(currentStorageKey) || '[]');
    }

    $: (async () => (addressObjectList = await retrieveBalances(addresses, currentClient)))();

    function isValidBech32(address: string): boolean {
        try {
            const humanReadablePart =
                currentNetwork === NetworkType.Dev
                    ? Bech32Helper.BECH32_DEFAULT_HRP_DEV
                    : Bech32Helper.BECH32_DEFAULT_HRP_MAIN;
            return !!Bech32Helper.fromBech32(address, humanReadablePart);
        } catch (e) {
            return false;
        }
    }

    async function retrieveBalance(address: string, client: SingleNodeClient): Promise<Address> {
        const addressInfo = await client.address(address);
        return {
            address,
            balance: addressInfo.balance,
        };
    }

    async function retrieveBalances(addresses: string[], client: SingleNodeClient): Promise<Address[]> {
        return Promise.all(addresses.map((address) => retrieveBalance(address, client)));
    }

    function handleSubmit() {
        if (isValidBech32(address) && !addresses.includes(address)) {
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
