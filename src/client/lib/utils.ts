import { Bech32Helper, SingleNodeClient, UnitsHelper } from '@iota/iota.js';
import { NetworkType, NodeEndpoint } from './types';
import type { Units } from '@iota/iota.js';

const client = {
    devnet: new SingleNodeClient(NodeEndpoint.Devnet),
    mainnet: new SingleNodeClient(NodeEndpoint.Mainnet),
};

export function formatUnit(balance: number, unit: Units) {
    const formattedString = UnitsHelper.formatUnits(balance, unit, 2);
    const [formattedNumber, unitSuffix] = formattedString.split(' ');
    return formattedNumber;
}

export function isValidBech32(address: string, network: NetworkType): boolean {
    try {
        const humanReadablePart =
            network === NetworkType.Dev ? Bech32Helper.BECH32_DEFAULT_HRP_DEV : Bech32Helper.BECH32_DEFAULT_HRP_MAIN;
        return !!Bech32Helper.fromBech32(address, humanReadablePart);
    } catch (e) {
        return false;
    }
}

export async function retrieveBalance(network: NetworkType, bech32Address: string): Promise<number> {
    const addressInfo = await client[network].address(bech32Address);
    return addressInfo.balance;
}
