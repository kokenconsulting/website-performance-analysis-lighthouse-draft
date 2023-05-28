import { BaseEngine } from "../base/BaseEngine.js";
import { v4 as uuidv4 } from "uuid";
import { AnalysisEngine } from "../analysis/AnalysisEngine.js";
import {
  standardNetworkSpeeds,
  cpuSlowdownMultipliers,
} from "../base/ThrottlingSettings.js";
import { SessionSummaryReport } from "../session/SessionSummaryReport.js";
import { ThrottlingManager } from "./ThrottlingManager.js";

export class SessionEngine extends BaseEngine {
  //constructor(webApplication, url, reportFolder, logger, sessionId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
  constructor(sessionConfiguration, logger, sessionId = null) {
    super(logger);
    this.webApplication = sessionConfiguration.webApplication;
    this.url = sessionConfiguration.url;
    this.reportFolder = sessionConfiguration.reportFolderRelativePath;
    this.setSessionId(sessionId);
    this.sessionSummaryReport = new SessionSummaryReport(
      this.webApplication,
      this.reportFolder,
      this.logger,
      this.sessionId
    );
    this.AnalysisEngine = new AnalysisEngine(
      this.webApplication,
      this.url,
      this.reportFolder,
      this.logger,
      this.sessionId
    );
    //({ cpuSlowdownMultiplierArray, networkSpeedArray } = this.determineThrottlingConfiguration(sessionConfiguration.throttlingSettings));
    this.cpuSlowdownMultiplierArray =
      sessionConfiguration.throttlingSettings.cpuSlowDownMultipliers;
    this.networkSpeedArray =
      sessionConfiguration.throttlingSettings.networkSpeeds;
  }
  setSessionId(sessionId) {
    if (sessionId == null || sessionId === undefined) {
      this.sessionId = uuidv4();
    } else {
      this.sessionId = sessionId;
    }
    this.logger.logInfo(`Session id is ${this.sessionId}`);
  }

  async runWithBuiltInThrottling() {
    for (const networkSpeed of this.networkSpeedArray) {
      for (const cpuSlowdownMultiplier of this.cpuSlowdownMultiplierArray) {
        this.logger.logInfo(
          `cpuSlowdownMultiplier is ${cpuSlowdownMultiplier} and network speed is ${networkSpeed}`
        );
        await this.AnalysisEngine.orchestrateAnalysisWithThrottling(
          false,
          cpuSlowdownMultiplier,
          networkSpeed
        );
      }
    }
    this.sessionSummaryReport.generate();
    return this.sessionId;
  }

  async runWithExternalThrottling() {
    var throttlingManager = new ThrottlingManager(this.logger);
    for (let networkSpeedItem of this.networkSpeedArray) {
      this.logger.logInfo(
        `nework item data @sitespeed.io/throttle throttling with options ${JSON.stringify(
          networkSpeedItem
        )}`
      );
      const throttleOptions = {
        up: networkSpeedItem.throughputKbps,
        down: networkSpeedItem.throughputKbps,
        rtt: networkSpeedItem.rttMs,
      };

      this.logger.logInfo(
        `option data @sitespeed.io/throttle throttling with options ${JSON.stringify(
          throttleOptions
        )}`
      );
      await throttlingManager.startThrottling(throttleOptions);
      for (const cpuSlowdownMultiplier of this.cpuSlowdownMultiplierArray) {
        this.logger.logInfo(
          `Starting analysis for cpu slowdown multiplier ${cpuSlowdownMultiplier} and network speed ${JSON.stringify(
            networkSpeedItem
          )}`
        );
        await this.AnalysisEngine.orchestrateAnalysisWithThrottling(
          true,
          cpuSlowdownMultiplier,
          networkSpeedItem
        );
      }
      this.logger.logInfo(
        `Stopping @sitespeed.io/throttle throttling with options ${JSON.stringify(
          throttleOptions
        )}`
      );
      await throttlingManager.stopThrottling();
    }
    this.sessionSummaryReport.generate();
  }

  // determineThrottlingConfiguration(throttlingSettings) {
  //   if (throttlingSettings.CPUSlowDownMultipliers == null) {
  //     cpuSlowdownMultiplierArray = cpuSlowdownMultipliers;
  //   }
  //   if (throttlingSettings.NetworkSpeeds == null) {
  //     networkSpeedArray = standardNetworkSpeeds;
  //   }
  //   return { cpuSlowdownMultiplierArray, networkSpeedArray };
  // }
}
