import { start, stop } from '@sitespeed.io/throttle'
import { v4 as uuidv4 } from 'uuid';
import { orchestrateAnalysisWithThrottling } from '../analysis/analyze.js';
import { standardNetworkSpeeds, cpuSlowdownMultipliers } from '../config/throttling.js';
import { logInfo } from '../log/processlogger.js';
export async function runAnalysisWithBuiltInThrottling(appInfo, url, reportFolder, sessionId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    //if sessionid is null, generate a uuid4
    sessionId = setSessionId(sessionId);
    //if cpuSlowdownMultiplierArray is null, use the default
    ({ cpuSlowdownMultiplierArray, networkSpeedArray } = setThrottlingValues(cpuSlowdownMultiplierArray, networkSpeedArray));

    for (const networkSpeed of networkSpeedArray) {
        for (const cpuSlowdownMultiplier of cpuSlowdownMultiplierArray) {
            //no external throttling
            await orchestrateAnalysisWithThrottling(sessionId, appInfo, url, false, networkSpeed, cpuSlowdownMultiplier, reportFolder);
        }
    }
    return sessionId;
}

export async function runAnalysisWithExternalThrottling(appInfo, url, reportFolder, sessionId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    sessionId = setSessionId(sessionId);
    ({ cpuSlowdownMultiplierArray, networkSpeedArray } = setThrottlingValues(cpuSlowdownMultiplierArray, networkSpeedArray));

    for (const networkSpeed of networkSpeedArray) {
        const options = { up: networkSpeed.throughputKbps, down: networkSpeed.throughputKbps, rtt: networkSpeed.rttMs };
        logInfo(`Starting @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
        await start(options);
        for (const cpuSlowdownMultiplier of cpuSlowdownMultiplierArray) {
            logInfo(`Starting analysis for cpu slowdown multiplier ${cpuSlowdownMultiplier} and network speed ${JSON.stringify(networkSpeed)}`);
            //external throttling used
            await orchestrateAnalysisWithThrottling(sessionId, appInfo, url, true, networkSpeed, cpuSlowdownMultiplier, reportFolder);
        }
        logInfo(`Stopping @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
        await stop();
    }
    return sessionId;
}


export function setSessionId(sessionId) {
    if (sessionId == null) {
        sessionId = uuidv4();
    }
    logInfo(`Session id is ${sessionId}`);
    return sessionId;
}

function setThrottlingValues(cpuSlowdownMultiplierArray, networkSpeedArray) {
    if (cpuSlowdownMultiplierArray == null) {
        cpuSlowdownMultiplierArray = cpuSlowdownMultipliers;
    }
    //if networkSpeedArray is null, use the default
    if (networkSpeedArray == null) {
        networkSpeedArray = standardNetworkSpeeds;
    }
    return { cpuSlowdownMultiplierArray, networkSpeedArray };
}

