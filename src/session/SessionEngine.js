import { start, stop } from '@sitespeed.io/throttle'
import { BaseEngine } from '../base/BaseEngine.js';
import { v4 as uuidv4 } from 'uuid';
import { AnalysisEngine } from '../analysis/AnalysisEngine.js';
import { standardNetworkSpeeds, cpuSlowdownMultipliers } from '../base/throttling.js';
import { SessionSummaryReport } from '../session/SessionSummaryReport.js';

export class SessionEngine extends BaseEngine {
  constructor(appInfo, url, reportFolder, logger, sessionId = null) {
    super(logger);
    this.appInfo = appInfo;
    this.url = url;
    this.reportFolder = reportFolder;
    this.setSessionId(sessionId);
    this.sessionSummaryReport = new SessionSummaryReport(appInfo, reportFolder, this.logger, this.sessionId);
    this.AnalysisEngine = new AnalysisEngine(appInfo, url, reportFolder, logger, this.sessionId);
  }
  setSessionId(sessionId) {
    if (sessionId == null || sessionId === undefined) {
      this.sessionId = uuidv4();
    } else {
      this.sessionId = sessionId;
    }
    this.logger.logInfo(`Session id is ${this.sessionId}`);
  }

  async runWithBuiltInThrottling(sessionId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    sessionId = this.setSessionId(sessionId);
    ({ cpuSlowdownMultiplierArray, networkSpeedArray } = this.setThrottlingValues(cpuSlowdownMultiplierArray, networkSpeedArray));

    for (const networkSpeed of networkSpeedArray) {
      for (const cpuSlowdownMultiplier of cpuSlowdownMultiplierArray) {
        await this.AnalysisEngine.orchestrateAnalysisWithThrottling(false, cpuSlowdownMultiplier, networkSpeed);
      }
    }
    this.sessionSummaryReport.generate();
    return sessionId;
  }

  async runWithExternalThrottling(cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    ({ cpuSlowdownMultiplierArray, networkSpeedArray } = this.setThrottlingValues(cpuSlowdownMultiplierArray, networkSpeedArray));

    for (const networkSpeed of networkSpeedArray) {
      const options = { up: networkSpeed.throughputKbps, down: networkSpeed.throughputKbps, rtt: networkSpeed.rttMs };
      this.logger.logInfo(`Starting @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
      await start(options);
      for (const cpuSlowdownMultiplier of cpuSlowdownMultiplierArray) {
        this.logger.logInfo(`Starting analysis for cpu slowdown multiplier ${cpuSlowdownMultiplier} and network speed ${JSON.stringify(networkSpeed)}`);
        await this.AnalysisEngine.orchestrateAnalysisWithThrottling(true, cpuSlowdownMultiplier, networkSpeed);
      }
      this.logger.logInfo(`Stopping @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
      await stop();
    }
    this.sessionSummaryReport.generate();
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