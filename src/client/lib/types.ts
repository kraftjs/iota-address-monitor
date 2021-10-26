declare global {
    interface Window {
        api: {
            send: (channel: string, [network, bechAddress]: [NetworkType, string]) => void;
            receive: (channel: string, func: (arg0: any) => void) => void;
        };
    }
}

export enum NetworkType {
    Dev = 'devnet',
    Main = 'mainnet',
}

export enum LocalStorageKey {
    Network = 'selectedNetwork',
    Devnet = 'devnetAddresses',
    Mainnet = 'mainnetAddresses',
}

export enum NodeEndpoint {
    Devnet = 'https://api.lb-0.h.chrysalis-devnet.iota.cafe/',
    Mainnet = 'https://chrysalis-nodes.iota.org/',
}

export interface Address {
    bechAddress: string;
    balance: Promise<number> | number;
}
