export enum NetworkType {
    Dev = 'devnet',
    Main = 'mainnet',
}

export enum LocalStorage {
    SavedNetwork = 'selectedNetwork',
    DevAddresses = 'devnetAddresses',
    MainAddresses = 'mainnetAddresses',
}

export enum NodeEndpoint {
    Devnet = 'https://api.lb-0.h.chrysalis-devnet.iota.cafe/',
    Mainnet = 'https://chrysalis-nodes.iota.cafe/',
}

export interface Address {
    bechAddress: string;
    balance: number;
}
