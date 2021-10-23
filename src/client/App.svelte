<script lang="ts">
    import List from './components/List.svelte';
    import Form from './components/Form.svelte';
    import { addressInfo } from './stores/addressInfo';
    import { currentNetwork } from './stores/currentNetwork';
    import { LocalStorage, NetworkType } from './lib/types';
    import type { Address } from './lib/types';

    $: window.localStorage.setItem(LocalStorage.SavedNetwork, JSON.stringify($currentNetwork));
    $: saveBechAddresses($addressInfo[NetworkType.Dev], LocalStorage.DevAddresses);
    $: saveBechAddresses($addressInfo[NetworkType.Main], LocalStorage.MainAddresses);

    function saveBechAddresses(addresses: Address[], storageKey: LocalStorage) {
        const bechAddresses: string[] = addresses.map((address: Address) => address.bechAddress);
        window.localStorage.setItem(storageKey, JSON.stringify(bechAddresses));
    }
</script>

<Form />
<List />
