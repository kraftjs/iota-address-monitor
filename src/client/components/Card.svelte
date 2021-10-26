<script lang="ts">
    import { currentUnit } from '../stores/currentNetwork';
    import { formatUnit } from '../lib/utils';
    import type { Units } from '@iota/iota.js';

    export let selected;
    export let bechAddress;
    export let balance: number | Promise<number>;

    function cycleUnits() {
        const units: Units[] = ['i', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi'];
        const index = units.findIndex((unit) => unit === $currentUnit);
        $currentUnit = units[(index + 1) % units.length];
    }

    function handleSelect(event) {
        if (!event.target.closest('#units')) selected = bechAddress;
    }
</script>

<li on:click={handleSelect} class:selected={bechAddress === selected}>
    {#await balance}
        <p>{bechAddress}</p>
        <span>...loading</span>
    {:then balanceValue}
        <p>{bechAddress}</p>
        <span>
            {formatUnit(balanceValue, $currentUnit)}
            <button id="units" type="button" on:click={cycleUnits}>{$currentUnit}</button>
        </span>
    {:catch error}
        <p>{bechAddress}</p>
        <span>{error.message}</span>
    {/await}
</li>

<style>
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8em 0 4em;
        font-family: monospace;
        font-size: 0.875rem;
        background-color: #f2f5fb;
    }

    p {
        display: inline;
    }

    span {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 1em;
        font-family: monospace;
        min-width: 13em;
    }

    button {
        font-size: 1em;
        font-family: monospace;
        cursor: pointer;
        border: none;
        background-color: transparent;
        text-decoration: underline;
        min-width: 2.5em;
    }

    .selected {
        background-color: #00e0ca;
    }
</style>
