import { writable } from 'svelte/store';
import type { Address } from '../lib/types';
import { LocalStorageKey, NetworkType } from '../lib/types';
import { retrieveBalance } from '../lib/utils';

const { subscribe, set, update } = writable<{ devnet: Address[]; mainnet: Address[] }>({
    devnet: loadFromLocalStorage(LocalStorageKey.Devnet),
    mainnet: loadFromLocalStorage(LocalStorageKey.Mainnet),
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
    initialize: async () => {
        const devnetAddressInfo = await name(NetworkType.Dev, LocalStorageKey.Devnet);
        const mainnetAddressInfo = await name(NetworkType.Main, LocalStorageKey.Mainnet);
        update((self) => {
            self.devnet = devnetAddressInfo;
            self.mainnet = mainnetAddressInfo;
            return self;
        });
        new Promise<void>(function (resolve) {
            setTimeout(() => resolve(), 1000);
        });
    },
    set,
    update,
};

function loadFromLocalStorage(storageKey: LocalStorageKey): Address[] {
    const bechAddresses: string[] = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return bechAddresses.map((bechAddress) => ({ bechAddress, balance: 0 }));
}

async function name(network: NetworkType, storageKey: LocalStorageKey): Promise<Address[]> {
    return Promise.all(
        loadFromLocalStorage(storageKey).map(async ({ bechAddress, balance }: Address) => {
            balance = await retrieveBalance(bechAddress, network);
            return {
                bechAddress,
                balance,
            };
        }),
    );
}
