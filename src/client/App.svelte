<!--suppress CssUnknownTarget -->
<script lang="ts">
    import { onMount } from 'svelte';

    import List from './components/List.svelte';
    import Form from './components/Form.svelte';
    import { addressInfo } from './stores/addressInfo';
    import { currentNetwork, currentUnit } from './stores/currentNetwork';
    import { LocalStorageKey, NetworkType } from './lib/types';
    import type { Address } from './lib/types';
    import svg from './IOTA.svg';

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
    <header>
        <img src={svg} alt="Powered By IOTA logo" />
        <Form />
    </header>
    {#await promise}
        <div style="display: grid; justify-content: center"><h1>...RETRIEVING BALANCES</h1></div>
    {:then _}
        <List />
    {:catch error}
        <h1>{error.message}</h1>
    {/await}
</div>

<style>
    header {
        height: 360px;
        width: 100%;
    }
    img {
        display: block;
        max-height: 90%;
        margin: auto;
    }
    .container {
        max-width: 1060px;
        min-width: 1000px;
        width: 1060px;
    }
</style>
