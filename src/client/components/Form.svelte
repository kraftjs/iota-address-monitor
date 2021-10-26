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
    <div class="switch-container">
        <label class:checked={$currentNetwork === NetworkType.Dev}
            ><input type="radio" bind:group={$currentNetwork} name="network" value={NetworkType.Dev} />
            devnet</label
        >

        <label class:checked={$currentNetwork === NetworkType.Main}>
            <input type="radio" bind:group={$currentNetwork} name="network" value={NetworkType.Main} />
            mainnet</label
        >
    </div>
    <input type="text" placeholder="Enter address" bind:value={address} />
    <button type="submit">Add</button>
</form>

<style>
    .switch-container {
        display: flex;
        margin-bottom: 2.25em;
        overflow: hidden;
    }

    .switch-container label input {
        position: absolute;
        clip: rect(0, 0, 0, 0);
        height: 1px;
        width: 1px;
        border: 0;
        overflow: hidden;
    }

    .switch-container label {
        background-color: #f2f5fb;
        font-size: 0.875em;
        line-height: 1;
        text-align: center;
        padding: 0.5em 1em;
        margin-right: -1px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
        transition: all 0.1s ease-in-out;
    }

    .switch-container label.checked {
        background-color: #00e0ca;
        box-shadow: none;
    }

    .switch-container label:first-of-type {
        border-radius: 0.25em 0 0 0.25em;
    }

    .switch-container label:last-of-type {
        border-radius: 0 0.25em 0.25em 0;
    }

    input {
        padding: 0.25em 0.5em;
    }
</style>
