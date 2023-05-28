export const standardNetworkSpeeds = [
    // { rttMs: 100, throughputKbps: 1500 },
    // { rttMs: 100, throughputKbps: 2500 },
    // { rttMs: 100, throughputKbps: 5000 },
    // { rttMs: 100, throughputKbps: 10000 },
    // //{ rttMs: 100, throughputKbps: 20000 },
    // { rttMs: 100, throughputKbps: 22500 },
    // { rttMs: 100, throughputKbps: 25000 },
    // //{ rttMs: 100, throughputKbps: 27500 },
    // { rttMs: 100, throughputKbps: 28000 },
    //{ rttMs: 100, throughputKbps: 29000 },
    { rttMs: 100, throughputKbps: 29500 },
    //{ rttMs: 100, throughputKbps: 30000 },
    //{ rttMs: 100, throughputKbps: 35000 },
    //{ rttMs: 100, throughputKbps: 40000 },
    //{ rttMs: 100, throughputKbps: 45000 },
];

export const cpuSlowdownMultipliers = [0];

export class ThrottlingSettings {
    constructor(networkSpeeds, cpuSlowDownMultipliers) {
        this.networkSpeeds = networkSpeeds;
        this.cpuSlowDownMultipliers = cpuSlowDownMultipliers;
    }
}

export const StandardThrottlingSettings = new ThrottlingSettings(standardNetworkSpeeds, cpuSlowdownMultipliers);