<script lang="ts">
    import { onMount } from 'svelte';

    import List from './components/List.svelte';
    import Form from './components/Form.svelte';
    import { addressInfo } from './stores/addressInfo';
    import { currentNetwork } from './stores/currentNetwork';
    import { LocalStorageKey, NetworkType } from './lib/types';
    import type { Address } from './lib/types';

    let promise: Promise<void>;

    onMount(async () => {
        promise = addressInfo.initialize();
    });

    $: window.localStorage.setItem(LocalStorageKey.Network, JSON.stringify($currentNetwork));
    $: saveBechAddresses($addressInfo[NetworkType.Dev], LocalStorageKey.Devnet);
    $: saveBechAddresses($addressInfo[NetworkType.Main], LocalStorageKey.Mainnet);

    function saveBechAddresses(addresses: Address[], storageKey: LocalStorageKey) {
        const bechAddresses: string[] = addresses.map((address: Address) => address.bechAddress);
        window.localStorage.setItem(storageKey, JSON.stringify(bechAddresses));
    }
</script>

<Form />
{#await promise}
    <h1>...RETRIEVING BALANCES</h1>
{:then _}
    <List />
{:catch error}
    <h1>{error.message}</h1>
{/await}
