import { writable } from 'svelte/store';
import { LocalStorage } from '../lib/types';
import type { NetworkType } from '../lib/types';

export const currentNetwork = writable<NetworkType>(
    JSON.parse(window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"'),
);
