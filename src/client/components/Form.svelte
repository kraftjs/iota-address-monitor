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
            }
            address = '';
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
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
    <input
        type="text"
        spellcheck="false"
        maxlength="64"
        placeholder={`Enter address (${$currentNetwork === 'mainnet' ? 'iota1' : 'atoi1'}...)`}
        bind:value={address}
    />
    <button type="submit" disabled={!isValidBech32(address, $currentNetwork)}>add</button>
    <button type="button" on:click={() => window.api.send('refresh', null)}>&#8635;</button>
</form>

<style>
    form {
        display: flex;
        justify-content: center;
        margin-bottom: 0.5em;
    }

    input[type='text'] {
        padding: 0.5em 1em;
        width: 500px;
        font-family: monospace;
        font-size: 0.9375em;
        margin: 0 0.25em;
    }

    .switch-container {
        display: inline-flex;
        overflow: hidden;
        margin: 0 0.25em;
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

    button {
        padding: 0.25em 0.5em;
        margin: 0 0.25em;
    }
</style>
