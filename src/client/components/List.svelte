<script lang="ts">
    import Card from './Card.svelte';
    import { addressInfo } from '../stores/addressInfo';
    import { currentNetwork } from '../stores/currentNetwork';
    import type { Address } from '../lib/types';

    let search = '';
    let selected = null;

    $: addressDataToShow = $addressInfo[$currentNetwork];
    $: filteredData = search
        ? addressDataToShow.filter(({ bechAddress, balance }: Address) => {
              return bechAddress.includes(search) || balance.toString().includes(search);
          })
        : addressDataToShow;
    $: if ($currentNetwork) selected = null;

    function handleDelete(addressToRemove: string) {
        console.log(`handleDelete ${addressToRemove}`);
        addressInfo.removeAddress($currentNetwork, addressToRemove);
        selected = null;
    }

    function handleWindowClick(event) {
        if (!event.target.closest('.list-container')) {
            selected = null;
        }
    }
</script>

<svelte:window on:click={handleWindowClick} />
<div class="list-container">
    <input
        type="search"
        placeholder="search address or balance"
        bind:value={search}
        disabled={!addressDataToShow.length}
    />
    <button type="button" on:click={() => handleDelete(selected)} disabled={!selected}>delete</button>
    <ul>
        {#each filteredData as addressData (addressData.bechAddress)}
            <Card {...addressData} bind:selected />
        {/each}
    </ul>
</div>

<style>
    input {
        padding: 0.25em 0.5em;
    }

    button {
        padding: 0.25em 0.5em;
    }

    ul {
        padding: 0;
        list-style-type: none;
    }
</style>
