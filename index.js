import { start, stop } from '@sitespeed.io/throttle'
import { AppInfo } from './models/AppInfo.js';
import { orchestrateAnalysisWithBuiltInThrottling, generateDataForSession ,orchestrateWithExternalNetworkThrottling} from './analysis/analyze.js';
import {logInfo as internalLogInfo} from './log/processlogger.js';
import { cpuSlowDownMultiplierImpactAnalysis as internalcpuSlowDownMultiplierImpactAnalysis } from './chartdata/specificApplication.js';
import { standardNetworkSpeeds, cpuSlowdownMultipliers } from './analysis/config.js';
import { v4 as uuidv4 } from 'uuid';

export async function runAnalysisWithBuiltInThrottling(appInfo, url, reportFolder, sessionId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
  //if sessionid is null, generate a uuid4
  if (sessionId == null) {
    sessionId = uuidv4();
  }
  //if cpuSlowdownMultiplierArray is null, use the default
  if (cpuSlowdownMultiplierArray == null) {
    cpuSlowdownMultiplierArray = cpuSlowdownMultipliers;
  }
  //if networkSpeedArray is null, use the default
  if (networkSpeedArray == null) {
    networkSpeedArray = standardNetworkSpeeds;
  }

  logInfo(`Session id is ${sessionId}`);
  for (const cpuSlowdownMultiplier of cpuSlowdownMultiplierArray) {
    for (const networkSpeed of networkSpeedArray) {
      await orchestrateAnalysisWithBuiltInThrottling(sessionId, appInfo, url, networkSpeed, cpuSlowdownMultiplier, reportFolder);
    }
  }
}
export { AppInfo, generateDataForSession }

export function logInfo(message) {
  internalLogInfo(message)
}
export function cpuSlowDownMultiplierImpactAnalysis(appInfo, sessionId, reportFolder) {
  return internalcpuSlowDownMultiplierImpactAnalysis(appInfo, sessionId, reportFolder)
}

export async function runAnalysisWithExternalThrottling(appInfo, url, reportFolder, sessionId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
  //if sessionid is null, generate a uuid4
  if (sessionId == null) {
    sessionId = uuidv4();
  }
  //if cpuSlowdownMultiplierArray is null, use the default
  if (cpuSlowdownMultiplierArray == null) {
    cpuSlowdownMultiplierArray = cpuSlowdownMultipliers;
  }
  //if networkSpeedArray is null, use the default
  if (networkSpeedArray == null) {
    networkSpeedArray = standardNetworkSpeeds;
  }
  //https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md
  // import throttle from '@sitespeed.io/throttle'
  // // Returns a promise
  // const options = {up: 360, down: 780, rtt: 200};
  // await throttle.start(options);
  // // Do your thing and then stop
  // await throttle.stop();

  logInfo(`Session id is ${sessionId}`);
  for (const networkSpeed of networkSpeedArray) {
    const options = { up: networkSpeed.throughputKbps, down: networkSpeed.throughputKbps, rtt: networkSpeed.rttMs };
    logInfo(`Starting @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
    await start(options);
    for (const cpuSlowdownMultiplier of cpuSlowdownMultiplierArray) {
      logInfo(`Starting analysis for cpu slowdown multiplier ${cpuSlowdownMultiplier} and network speed ${JSON.stringify(networkSpeed)}`);
      await orchestrateWithExternalNetworkThrottling(sessionId, appInfo, url, networkSpeed, cpuSlowdownMultiplier, reportFolder);
    }
    logInfo(`Stopping @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
    await stop();
  }
}
