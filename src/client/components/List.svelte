<script lang="ts">
    import { addressInfo } from '../stores/addressInfo';
    import { currentNetwork } from '../stores/currentNetwork';
    import type { Address } from '../lib/types';

    let search = '';

    $: addressDataToShow = $addressInfo[$currentNetwork];
    $: filteredData = search
        ? addressDataToShow.filter(({ bechAddress, balance }: Address) => {
              return bechAddress.includes(search) || balance.toString().includes(search);
          })
        : addressDataToShow;

    function handleDelete(addressToRemove: String) {
        console.log(`handleDelete ${addressToRemove}`);
        addressInfo.remove($currentNetwork, addressToRemove);
    }
</script>

<input type="search" placeholder="search address or balance" bind:value={search} />
<ul>
    {#each filteredData as { bechAddress, balance: promise } (bechAddress)}
        <li>
            {#await promise}
                <button type="button" on:click={() => handleDelete(bechAddress)}>Delete</button>{bechAddress}...loading
            {:then balance}
                <button type="button" on:click={() => handleDelete(bechAddress)}>Delete</button>{bechAddress}{balance}
            {:catch error}
                <button type="button" on:click={() => handleDelete(bechAddress)}>Delete</button
                >{bechAddress}{error.message}
            {/await}
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
