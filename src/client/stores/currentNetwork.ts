import { writable } from 'svelte/store';
import { LocalStorageKey } from '../lib/types';
import type { NetworkType } from '../lib/types';
import type { Units } from '@iota/iota.js';

export const currentNetwork = writable<NetworkType>(
    JSON.parse(window.localStorage.getItem(LocalStorageKey.Network) || '"devnet"'),
);

export const currentUnit = writable<Units>(JSON.parse(window.localStorage.getItem(LocalStorageKey.Unit) || '"i"'));
