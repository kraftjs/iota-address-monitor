<script lang="ts">
    import { onMount } from 'svelte';

    import List from './components/List.svelte';
    import Form from './components/Form.svelte';
    import { addressInfo } from './stores/addressInfo';
    import { currentNetwork, currentUnit } from './stores/currentNetwork';
    import { LocalStorageKey, NetworkType } from './lib/types';
    import type { Address } from './lib/types';

    let promise: Promise<void>;

    onMount(async () => {
        promise = addressInfo.initialize();
        window.api.receive('activityOnAddress', ({ network, bechAddress }) =>
            addressInfo.refreshBalance(network, bechAddress),
        );
    });

    $: window.localStorage.setItem(LocalStorageKey.Unit, JSON.stringify($currentUnit));
    $: window.localStorage.setItem(LocalStorageKey.Network, JSON.stringify($currentNetwork));
    $: saveBechAddresses($addressInfo[NetworkType.Dev], LocalStorageKey.Devnet);
    $: saveBechAddresses($addressInfo[NetworkType.Main], LocalStorageKey.Mainnet);

    function saveBechAddresses(addresses: Address[], storageKey: LocalStorageKey) {
        const bechAddresses: string[] = addresses.map((address: Address) => address.bechAddress);
        window.localStorage.setItem(storageKey, JSON.stringify(bechAddresses));
    }
</script>

<div class="container">
    <Form />
    {#await promise}
        <h1>...RETRIEVING BALANCES</h1>
    {:then _}
        <List />
    {:catch error}
        <h1>{error.message}</h1>
    {/await}
</div>

<style>
    .container {
        max-width: 1060px;
        width: 1060px;
    }
</style>
