<script lang="ts">
    import { isValidBech32 } from '../lib/utils';
    import { NetworkType } from '../lib/types';
    import { devnetBechAddresses, mainnetBechAddresses } from '../stores/localStorage';

    export let currentNetwork;
    let address = '';

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
</script>

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

<style>
    input {
        padding: 0.25em 0.5em;
    }
</style>
