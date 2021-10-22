import { derived, Readable } from 'svelte/store';
import { Address, NetworkType } from '../lib/types';
import { retrieveBalances } from '../lib/utils';
import { devnetBechAddresses, mainnetBechAddresses } from './localStorage';

export const devnetAddressData = derived<Readable<string[]>, Address[]>(
    devnetBechAddresses,
    ($devnetBechAddresses, set) => {
        retrieveBalances($devnetBechAddresses, NetworkType.Dev)
            .then((data) => set(data))
            .catch((e) => console.log(e.message));
    },
    [],
);
export const mainnetAddressData = derived<Readable<string[]>, Address[]>(
    mainnetBechAddresses,
    ($mainnetBechAddresses, set) => {
        retrieveBalances($mainnetBechAddresses, NetworkType.Main)
            .then((data) => set(data))
            .catch((e) => console.log(e.message));
    },
    [],
);
