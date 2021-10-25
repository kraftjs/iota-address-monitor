import { MqttClient } from '@iota/mqtt.js';

const MAINNET_ENDPOINTS = ['https://chrysalis-nodes.iota.org/', 'https://chrysalis-nodes.iota.cafe/'];
const DEVNET_ENDPOINTS = [
    'https://api.lb-0.h.chrysalis-devnet.iota.cafe/',
    'https://api.lb-1.h.chrysalis-devnet.iota.cafe/',
];
const subscriptions = {
    mainnet: new Map<string, string>(),
    devnet: new Map<string, string>(),
};

const mqttClients = {
    mainnet: new MqttClient(MAINNET_ENDPOINTS),
    devnet: new MqttClient(DEVNET_ENDPOINTS),
};

export function mqttSubscribe(
    network: 'mainnet' | 'devnet',
    bechAddress: string,
    callback: (topic: any, data: any) => void,
) {
    if (subscriptions[network].has(bechAddress)) return;
    const subscriptionId = mqttClients[network].addressOutputs(bechAddress, callback);
    subscriptions[network].set(bechAddress, subscriptionId);
}

export function mqttUnsubscribe(network: 'mainnet' | 'devnet', bechAddress: string) {
    const subscriptionId = subscriptions[network].get(bechAddress);
    if (!subscriptionId) return;
    mqttClients[network].unsubscribe(subscriptionId);
}

export function mqttUnsubscribeAll() {
    for (const subscriptionId of subscriptions.mainnet.values()) {
        mqttClients.mainnet.unsubscribe(subscriptionId);
    }
    for (const subscriptionId of subscriptions.devnet.values()) {
        mqttClients.devnet.unsubscribe(subscriptionId);
    }
}
