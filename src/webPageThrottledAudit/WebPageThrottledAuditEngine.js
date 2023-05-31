import { EngineBase } from "../base/EngineBase.js";
import { v4 as uuidv4 } from "uuid";
import { AuditEngine } from "../audit/AuditEngine.js";
// import { WebPageThrottledAuditSummaryReport } from "./reports/WebPageThrottledAuditSummaryReport.js";
// import { WebPageThrottledAuditSummaryChartData } from "./chart/WebPageThrottledAuditSummaryChartData.js";
import { ThrottlingManager } from "../throttling/ThrottlingManager.js";

export class WebPageThrottledAuditEngine extends EngineBase {
  constructor(webPageThrottledAuditConfiguration, logger, auditInstanceId = null) {
    //TODO - Add validation for webPageThrottledAuditConfiguration, logger and auditInstanceId.
    super(logger);
    this.webPageThrottledAuditConfiguration = webPageThrottledAuditConfiguration;
    this.reportFolderFullPath = webPageThrottledAuditConfiguration.reportFolderFullPath;
    this.setAuditInstanceId(auditInstanceId);
    this.cpuSlowdownMultiplierArray =
      this.webPageThrottledAuditConfiguration.throttlingSettings.cpuSlowDownMultipliers;
    this.networkSpeedArray =
      this.webPageThrottledAuditConfiguration.throttlingSettings.networkSpeeds;
  }

  setAuditInstanceId(auditInstanceId) {
    if (auditInstanceId == null || auditInstanceId === undefined) {
      this.auditInstanceId = uuidv4();
    } else {
      this.auditInstanceId = auditInstanceId;
    }
    this.logger.logInfo(`Audit instance id is ${this.auditInstanceId}`);
  }
  async run(useExternalThrottling = true) {
    let auditInstanceId;
    if (useExternalThrottling === true) {
      this.logger.logInfo("Running with external throttling");
      auditInstanceId = await this.runWithExternalThrottling();
    } else {
      this.logger.logInfo("Running with built throttling");
      auditInstanceId = await this.runWithBuiltInThrottling();
    }
    // const summaryPath = await this.WebPageThrottledAuditSummaryReport.generate();
    // this.logger.logInfo(`Summary report path is ${summaryPath}`);
    // const chartReportPath = this.WebPageThrottledAuditSummaryChartData.generate();
    // this.logger.logInfo(`Chart report path is ${chartReportPath}`);
    // return { summaryPath, chartReportPath };
    return auditInstanceId;
  }
  async runWithBuiltInThrottling() {
    for (const networkSpeed of this.networkSpeedArray) {
      for (const cpuSlowdownMultiplier of this.cpuSlowdownMultiplierArray) {
        this.logger.logInfo(
          `cpuSlowdownMultiplier is ${cpuSlowdownMultiplier} and network speed is ${networkSpeed}`
        );
        const auditEngine = new AuditEngine(
          this.webPageThrottledAuditConfiguration.webPage,
          this.webPageThrottledAuditConfiguration.webApplication,
          this.webPageThrottledAuditConfiguration.reportFolderFullPath,
          this.logger,
          this.auditInstanceId,
          false,
          cpuSlowdownMultiplier,
          networkSpeed
        );
        await auditEngine.runAuditWithThrottling();
      }
    }
    return this.auditInstanceId;
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
        const auditEngine = new AuditEngine(
          this.webPageThrottledAuditConfiguration.webPage,
          this.webPageThrottledAuditConfiguration.webApplication,
          this.webPageThrottledAuditConfiguration.reportFolderFullPath,
          this.logger,
          this.auditInstanceId,
          true,
          cpuSlowdownMultiplier,
          networkSpeedItem
        );
        await auditEngine.runAuditWithThrottling();
      }
      this.logger.logInfo(
        `Stopping @sitespeed.io/throttle throttling with options ${JSON.stringify(
          throttleOptions
        )}`
      );
      await throttlingManager.stopThrottling();
    }
    return this.auditInstanceId;
  }
}
