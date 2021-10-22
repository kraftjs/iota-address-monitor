<script lang="ts">
    import List from './components/List.svelte';
    import Form from './components/Form.svelte';

    import { devnetBechAddresses, mainnetBechAddresses } from './stores/localStorage';
    import { LocalStorage, NetworkType } from './lib/types';

    let currentNetwork: NetworkType = JSON.parse(window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"');

    $: window.localStorage.setItem(LocalStorage.DevAddresses, JSON.stringify($devnetBechAddresses));
    $: window.localStorage.setItem(LocalStorage.MainAddresses, JSON.stringify($mainnetBechAddresses));
    $: window.localStorage.setItem(LocalStorage.SavedNetwork, JSON.stringify(currentNetwork));
</script>

<Form bind:currentNetwork />
<List {currentNetwork} />
