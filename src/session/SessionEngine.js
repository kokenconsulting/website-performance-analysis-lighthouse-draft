import { start, stop } from '@sitespeed.io/throttle'
import { v4 as uuidv4 } from 'uuid';
import { AnalysisEngine } from '../analysis/AnalysisEngine.js';
import { standardNetworkSpeeds, cpuSlowdownMultipliers } from '../config/throttling.js';
import {SessionSummaryReport} from '../session/SessionSummaryReport.js';

export class SessionEngine extends AnalysisEngine {
  constructor(appInfo, url, reportFolder,logger,sessionId=null) {
    super(appInfo, url, reportFolder, logger,sessionId);
    this.appInfo = appInfo;
    this.url = url;
    this.reportFolder = reportFolder;
    this.sessionId = setSessionId(sessionId);
    this.sessionSummaryReport = new SessionSummaryReport(appInfo,reportFolder,this.sessionId);
  }

  async runWithBuiltInThrottling(sessionId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    sessionId = this.setSessionId(sessionId);
    ({ cpuSlowdownMultiplierArray, networkSpeedArray } = this.setThrottlingValues(cpuSlowdownMultiplierArray, networkSpeedArray));

    for (const networkSpeed of networkSpeedArray) {
      for (const cpuSlowdownMultiplier of cpuSlowdownMultiplierArray) {
        await this.orchestrateAnalysisWithThrottling(sessionId, this.appInfo, this.url, false, networkSpeed, cpuSlowdownMultiplier, this.reportFolder);
      }
    }
    this.sessionSummaryReport.generate();
    return sessionId;
  }

  async runWithExternalThrottling(sessionId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    ({ cpuSlowdownMultiplierArray, networkSpeedArray } = this.setThrottlingValues(cpuSlowdownMultiplierArray, networkSpeedArray));

    for (const networkSpeed of networkSpeedArray) {
      const options = { up: networkSpeed.throughputKbps, down: networkSpeed.throughputKbps, rtt: networkSpeed.rttMs };
      this.logger.logInfo(`Starting @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
      await start(options);
      for (const cpuSlowdownMultiplier of cpuSlowdownMultiplierArray) {
        this.logger.logInfo(`Starting analysis for cpu slowdown multiplier ${cpuSlowdownMultiplier} and network speed ${JSON.stringify(networkSpeed)}`);
        await this.orchestrateAnalysisWithThrottling(sessionId, this.appInfo, this.url, true, networkSpeed, cpuSlowdownMultiplier, this.reportFolder);
      }
      this.logger.logInfo(`Stopping @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
      await stop();
    }
    this.sessionSummaryReport.generate();
  }

  setSessionId(sessionId) {
    if (sessionId == null || sessionId === undefined) {
      sessionId = uuidv4();
    }
    this.logger.logInfo(`Session id is ${sessionId}`);
  }
  get sessionId() {
    return this.sessionId;
  }

  setThrottlingValues(cpuSlowdownMultiplierArray, networkSpeedArray) {
    if (cpuSlowdownMultiplierArray == null) {
      cpuSlowdownMultiplierArray = cpuSlowdownMultipliers;
    }
    if (networkSpeedArray == null) {
      networkSpeedArray = standardNetworkSpeeds;
    }
    return { cpuSlowdownMultiplierArray, networkSpeedArray };
  }
}