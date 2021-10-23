import { writable } from 'svelte/store';
import { LocalStorageKey } from '../lib/types';
import type { NetworkType } from '../lib/types';

export const currentNetwork = writable<NetworkType>(
    JSON.parse(window.localStorage.getItem(LocalStorageKey.Network) || '"devnet"'),
);
