<script lang="ts">
    import { Address, NetworkType } from '../lib/types';
    import { devnetAddressData, mainnetAddressData } from '../stores/addressData';
    import { devnetBechAddresses, mainnetBechAddresses } from '../stores/localStorage';

    export let currentNetwork;
    let search = '';

    $: addressDataToShow = currentNetwork === NetworkType.Main ? $mainnetAddressData : $devnetAddressData;
    $: filteredData = search
        ? addressDataToShow.filter(({ bech32Address, balance }: Address) => {
              return bech32Address.includes(search) || balance.toString().includes(search);
          })
        : addressDataToShow;

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
<ul>
    {#each filteredData as { bech32Address, balance } (bech32Address)}
        <li>
            <button type="button" on:click={() => handleDelete(bech32Address)}>Delete</button>{bech32Address}{balance}
        </li>
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
