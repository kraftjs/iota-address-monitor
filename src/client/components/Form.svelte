<script lang="ts">
    import { isValidBech32 } from '../lib/utils';
    import { NetworkType } from '../lib/types';
    import { addressInfo } from '../stores/addressInfo';
    import { currentNetwork } from '../stores/currentNetwork';
    import type { Address } from '../lib/types';

    let address = '';

    function handleSubmit() {
        if (isValidBech32(address, $currentNetwork)) {
            if ($addressInfo[$currentNetwork].find(({ bechAddress }: Address) => bechAddress === address)) {
                console.log(`${address} already present`);
            } else {
                addressInfo.addAddress($currentNetwork, address);
                address = '';
            }
        } else {
            console.log('Invalid Bech32Address');
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <p>Please select which network to monitor:</p>
    <div>
        <label>
            <input type="radio" bind:group={$currentNetwork} name="network" value={NetworkType.Dev} />
            devnet
        </label>

        <label>
            <input type="radio" bind:group={$currentNetwork} name="network" value={NetworkType.Main} />
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
