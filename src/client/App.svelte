<script lang="ts">
    import { devnetBechAddresses, mainnetBechAddresses } from './stores/localStorage';
    import { devnetAddressData, mainnetAddressData } from './stores/addressData';
    import { Address, LocalStorage, NetworkType } from './lib/types';
    import { isValidBech32 } from './lib/utils';

    let currentNetwork: NetworkType = JSON.parse(window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"');
    let address = '';
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

    function handleSubmit() {
        if (isValidBech32(address, currentNetwork)) {
            if (currentNetwork === NetworkType.Main && !$mainnetBechAddresses.includes(address)) {
                $mainnetBechAddresses = [...$mainnetBechAddresses, address];
                address = '';
            } else if (currentNetwork === NetworkType.Dev && !$devnetBechAddresses.includes(address)) {
                $devnetBechAddresses = [...$devnetBechAddresses, address];
                address = '';
            } else if ($devnetBechAddresses.includes(address) || $mainnetBechAddresses.includes(address)) {
                console.log(`${address} already present`);
            }
        }
    }

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

<form on:submit|preventDefault={handleSubmit}>
    <p>Please select which network to monitor:</p>
    <div>
        <label>
            <input type="radio" bind:group={currentNetwork} name="network" value={NetworkType.Dev} />
            devnet
        </label>

        <label>
            <input type="radio" bind:group={currentNetwork} name="network" value={NetworkType.Main} />
            mainnet
        </label>
    </div>
    <input type="text" placeholder="Enter address" bind:value={address} />
    <button type="submit">Add</button>
</form>
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
