import { writable } from 'svelte/store';
import { LocalStorage } from '../lib/types';
import type { Address, NetworkType } from '../lib/types';
import { retrieveBalance } from '../lib/utils';

function initializeAddressInfo(storageKey: LocalStorage): Address[] {
    const bechAddresses: string[] = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return bechAddresses.map((bechAddress) => ({ bechAddress, balance: 0 }));
}

const { subscribe, set, update } = writable<{ devnet: Address[]; mainnet: Address[] }>({
    devnet: initializeAddressInfo(LocalStorage.DevAddresses),
    mainnet: initializeAddressInfo(LocalStorage.MainAddresses),
});

export const addressInfo = {
    subscribe,
    remove: (network: NetworkType, addressToRemove: string) =>
        update((self) => {
            self[network] = self[network].filter(({ bechAddress }) => addressToRemove !== bechAddress);
            // mqttUnsubscribe()
            return self;
        }),
    add: async (network: NetworkType, newAddress: string) => {
        const newAddressBalancePromise: Promise<number> = retrieveBalance(newAddress, network);
        update((self) => {
            self[network] = [...self[network], { bechAddress: newAddress, balance: newAddressBalancePromise }];
            // mqttSubscribe()
            return self;
        });
    },
    connect: async () => (n) => n,
    set,
    update,
};
