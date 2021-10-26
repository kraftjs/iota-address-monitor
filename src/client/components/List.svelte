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
    <div class="container">
        <input
            type="search"
            maxlength="64"
            placeholder="search address or balance"
            bind:value={search}
            disabled={!addressDataToShow.length}
        />
        <button type="button" on:click={() => handleDelete(selected)} disabled={!selected}>delete</button>
    </div>
    <ul>
        {#each filteredData as addressData (addressData.bechAddress)}
            <Card {...addressData} bind:selected />
        {/each}
    </ul>
</div>

<style>
    ul {
        padding: 0;
        list-style-type: none;
    }

    button {
        padding: 0.5em 1em;
        margin: 0 0.25em;
    }

    input[type='search'] {
        margin: 0 0.25em;
        padding: 0.5em 1em;
        width: 520px;
        font-family: monospace;
        font-size: 0.9375em;
    }

    .list-container {
        margin-top: 0.5em;
    }

    .container {
        display: flex;
        justify-content: center;
        padding: 0 5em;
    }
</style>
