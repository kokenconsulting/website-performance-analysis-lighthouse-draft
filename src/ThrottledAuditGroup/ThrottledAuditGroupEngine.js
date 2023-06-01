import { EngineBase } from "../base/EngineBase.js";
import { v4 as uuidv4 } from "uuid";
import { ThrottledAuditEngine } from "../throttledAudit/ThrottledAuditEngine.js";
import { ThrottlingManager } from "../throttling/ThrottlingManager.js";

export class ThrottledAuditGroupEngine extends EngineBase {
  constructor(webPageThrottledAuditConfiguration, logger, throttledAuditGroupId = null) {
    //TODO - Add validation for webPageThrottledAuditConfiguration, logger and throttledAuditGroupId.
    super(logger);
    this.webPageThrottledAuditConfiguration = webPageThrottledAuditConfiguration;
    this.reportFolderFullPath = webPageThrottledAuditConfiguration.reportFolderFullPath;
    this.setAuditGroupId(throttledAuditGroupId);
    this.cpuSlowdownMultiplierArray =
      this.webPageThrottledAuditConfiguration.throttlingSettings.cpuSlowDownMultipliers;
    this.networkSpeedArray =
      this.webPageThrottledAuditConfiguration.throttlingSettings.networkSpeeds;
  }

  setAuditGroupId(throttledAuditGroupId) {
    if (throttledAuditGroupId == null || throttledAuditGroupId === undefined) {
      this.throttledAuditGroupId = uuidv4();
    } else {
      this.throttledAuditGroupId = throttledAuditGroupId;
    }
    this.logger.logInfo(`Audit instance id is ${this.throttledAuditGroupId}`);
  }
  async run(useExternalThrottling = true) {
    let throttledAuditGroupId;
    if (useExternalThrottling === true) {
      this.logger.logInfo("Running with external throttling");
      throttledAuditGroupId = await this.runWithExternalThrottling();
    } else {
      this.logger.logInfo("Running with built throttling");
      throttledAuditGroupId = await this.runWithBuiltInThrottling();
    }
    // const summaryPath = await this.ThrottledAuditGroupSummaryReport.generate();
    // this.logger.logInfo(`Summary report path is ${summaryPath}`);
    // const chartReportPath = this.ThrottledAuditGroupSummaryChartData.generate();
    // this.logger.logInfo(`Chart report path is ${chartReportPath}`);
    // return { summaryPath, chartReportPath };
    return throttledAuditGroupId;
  }
  async runWithBuiltInThrottling() {
    for (const networkSpeed of this.networkSpeedArray) {
      for (const cpuSlowdownMultiplier of this.cpuSlowdownMultiplierArray) {
        this.logger.logInfo(
          `cpuSlowdownMultiplier is ${cpuSlowdownMultiplier} and network speed is ${networkSpeed}`
        );
        const auditEngine = new ThrottledAuditEngine(
          this.webPageThrottledAuditConfiguration.webPage,
          this.webPageThrottledAuditConfiguration.webApplication,
          this.webPageThrottledAuditConfiguration.reportFolderFullPath,
          this.logger,
          this.throttledAuditGroupId,
          false,
          cpuSlowdownMultiplier,
          networkSpeed
        );
        await auditEngine.runAuditWithThrottling();
      }
    }
    return this.throttledAuditGroupId;
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
        const auditEngine = new ThrottledAuditEngine(
          this.webPageThrottledAuditConfiguration.webPage,
          this.webPageThrottledAuditConfiguration.webApplication,
          this.webPageThrottledAuditConfiguration.reportFolderFullPath,
          this.logger,
          this.throttledAuditGroupId,
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
    return this.throttledAuditGroupId;
  }
}
