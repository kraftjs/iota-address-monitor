import { Bech32Helper, SingleNodeClient } from '@iota/iota.js';
import { Address, NetworkType, NodeEndpoint } from './types';

const client = {
    devnet: new SingleNodeClient(NodeEndpoint.Devnet),
    mainnet: new SingleNodeClient(NodeEndpoint.Mainnet),
};

export function isValidBech32(address: string, network: NetworkType): boolean {
    try {
        const humanReadablePart =
            network === NetworkType.Dev ? Bech32Helper.BECH32_DEFAULT_HRP_DEV : Bech32Helper.BECH32_DEFAULT_HRP_MAIN;
        return !!Bech32Helper.fromBech32(address, humanReadablePart);
    } catch (e) {
        return false;
    }
}

async function retrieveBalance(bech32Address: string, network: NetworkType): Promise<Address> {
    const addressInfo = await client[network].address(bech32Address);
    return {
        bech32Address,
        balance: addressInfo.balance,
    };
}

export async function retrieveBalances(addresses: string[], network: NetworkType): Promise<Address[]> {
    return Promise.all(addresses.map((address) => retrieveBalance(address, network)));
}
