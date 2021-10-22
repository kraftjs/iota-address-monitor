<script lang="ts">
    import Form from './components/Form.svelte';
    import { devnetBechAddresses, mainnetBechAddresses } from './stores/localStorage';
    import { devnetAddressData, mainnetAddressData } from './stores/addressData';
    import { Address, LocalStorage, NetworkType } from './lib/types';

    let currentNetwork: NetworkType = JSON.parse(window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"');
    let search = '';

    $: addressDataToShow = currentNetwork === NetworkType.Main ? $mainnetAddressData : $devnetAddressData;
    $: filteredData = search
        ? addressDataToShow.filter(({ address, balance }: Address) => {
              return address.includes(search) || balance.toString().includes(search);
          })
        : addressDataToShow;
    $: window.localStorage.setItem(LocalStorage.DevAddresses, JSON.stringify($devnetBechAddresses));
    $: window.localStorage.setItem(LocalStorage.MainAddresses, JSON.stringify($mainnetBechAddresses));
    $: window.localStorage.setItem(LocalStorage.SavedNetwork, JSON.stringify(currentNetwork));

    function handleDelete(addressToRemove: String) {
        console.log(`handleDelete ${addressToRemove}`);
        if (currentNetwork === NetworkType.Main) {
            $mainnetBechAddresses = $mainnetBechAddresses.filter((address) => addressToRemove !== address);
        } else {
            $devnetBechAddresses = $devnetBechAddresses.filter((address) => addressToRemove !== address);
        }
    }
</script>

<input type="search" placeholder="search address or balance" bind:value={search} />

<Form bind:currentNetwork />
<ul>
    {#each filteredData as { address, balance } (address)}
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
