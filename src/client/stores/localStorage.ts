import { writable } from 'svelte/store';
import { LocalStorage } from '../lib/types';

export const devnetBechAddresses = writable<string[]>(
    JSON.parse(window.localStorage.getItem(LocalStorage.DevAddresses) || '[]'),
);
export const mainnetBechAddresses = writable<string[]>(
    JSON.parse(window.localStorage.getItem(LocalStorage.MainAddresses) || '[]'),
);
