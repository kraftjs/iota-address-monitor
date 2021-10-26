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
    removeAddress: (network: NetworkType, addressToRemove: string) =>
        update((self) => {
            self[network] = self[network].filter(({ bechAddress }) => addressToRemove !== bechAddress);
            window.api.send('unsubscribe', [network, addressToRemove]);
            return self;
        }),
    addAddress: async (network: NetworkType, newAddress: string) => {
        const newAddressBalancePromise: Promise<number> = retrieveBalance(network, newAddress);
        update((self) => {
            self[network] = [...self[network], { bechAddress: newAddress, balance: newAddressBalancePromise }];
            window.api.send('subscribe', [network, newAddress]);
            return self;
        });
    },
    initialize: async () => {
        const devnetAddressInfo = await getBalancesAndMqttSubscribe(NetworkType.Dev, LocalStorageKey.Devnet);
        const mainnetAddressInfo = await getBalancesAndMqttSubscribe(NetworkType.Main, LocalStorageKey.Mainnet);
        update((self) => {
            self.devnet = devnetAddressInfo;
            self.mainnet = mainnetAddressInfo;
            return self;
        });
        new Promise<void>(function (resolve) {
            setTimeout(() => resolve(), 1000);
        });
    },
    refreshBalance: async (network: NetworkType, addressToRefresh: string) => {
        const refreshedAddressBalancePromise: Promise<number> = retrieveBalance(network, addressToRefresh);
        update((self) => {
            self[network] = self[network].map(({ bechAddress, balance }) => {
                if (bechAddress === addressToRefresh) {
                    balance = refreshedAddressBalancePromise;
                }
                return { bechAddress, balance };
            });
            return self;
        });
    },
    set,
    update,
};

function loadFromLocalStorage(storageKey: LocalStorageKey): Address[] {
    const bechAddresses: string[] = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return bechAddresses.map((bechAddress) => ({ bechAddress, balance: 0 }));
}

async function getBalancesAndMqttSubscribe(network: NetworkType, storageKey: LocalStorageKey): Promise<Address[]> {
    return Promise.all(
        loadFromLocalStorage(storageKey).map(async ({ bechAddress, balance }: Address) => {
            balance = await retrieveBalance(network, bechAddress);
            window.api.send('subscribe', [network, bechAddress]);
            return {
                bechAddress,
                balance,
            };
        }),
    );
}
