import { EngineBase } from "../Base/EngineBase.js";
import { v4 as uuidv4 } from "uuid";
import { ThrottledAuditEngine } from "../ThrottledAudit_2/ThrottledAuditEngine.js";
import { ThrottlingManager } from "../throttling/ThrottlingManager.js";
import { ThrottledAuditGroupSummaryReport } from '../ThrottledAuditGroup/reports/ThrottledAuditGroupSummaryReport.js'
import { ThrottledAuditGroupSummaryChartData } from '../ThrottledAuditGroup/chart/ThrottledAuditGroupSummaryChartData.js'
import { ThrottledAuditGroupConfiguration } from '../ThrottledAuditGroup/ThrottledAuditGroupConfiguration.js';
import { ProcessLogger } from "../Log/ProcessLogger.js";

export class ThrottledAuditGroupEngine extends EngineBase {
  private webPageThrottledAuditConfiguration: ThrottledAuditGroupConfiguration;
  private reportFolderFullPath: string;
  private throttledAuditGroupId!: string;
  private cpuSlowdownMultiplierArray: number[];
  private networkSpeedArray: any[];

  constructor(webPageThrottledAuditConfiguration: ThrottledAuditGroupConfiguration, logger: ProcessLogger, throttledAuditGroupId: string | null = null) {
    super(logger);
    this.webPageThrottledAuditConfiguration = webPageThrottledAuditConfiguration;
    this.reportFolderFullPath = webPageThrottledAuditConfiguration.reportFolderFullPath;
    this.setAuditGroupId(throttledAuditGroupId);
    this.cpuSlowdownMultiplierArray = this.webPageThrottledAuditConfiguration.throttlingSettings.cpuSlowDownMultipliers;
    this.networkSpeedArray = this.webPageThrottledAuditConfiguration.throttlingSettings.networkSpeeds;
  }

  private setAuditGroupId(throttledAuditGroupId: string | null): void {
    if (throttledAuditGroupId == null || throttledAuditGroupId === undefined) {
      this.throttledAuditGroupId = uuidv4();
    } else {
      this.throttledAuditGroupId = throttledAuditGroupId;
    }
    this.logger.logInfo(`Audit instance id is ${this.throttledAuditGroupId}`);
  }

  public async run(useExternalThrottling = true): Promise<string> {
    let throttledAuditGroupId: string;
    if (useExternalThrottling === true) {
      this.logger.logInfo("Running with external throttling");
      throttledAuditGroupId = await this.runWithExternalThrottling();
    } else {
      this.logger.logInfo("Running with built throttling");
      throttledAuditGroupId = await this.runWithBuiltInThrottling();
    }
    const summaryPath = await new ThrottledAuditGroupSummaryReport(this.webPageThrottledAuditConfiguration.webPage, this.webPageThrottledAuditConfiguration.webApplication, this.reportFolderFullPath, this.logger, this.throttledAuditGroupId).generate();
    this.logger.logInfo(`Summary report path is ${summaryPath}`);
    const chartReportPath = new ThrottledAuditGroupSummaryChartData(this.webPageThrottledAuditConfiguration.webPage, this.webPageThrottledAuditConfiguration.webApplication, this.reportFolderFullPath, this.logger, this.throttledAuditGroupId).generate();
    this.logger.logInfo(`Chart report path is ${chartReportPath}`);
    return throttledAuditGroupId;
  }

  private async runWithBuiltInThrottling(): Promise<string> {
    for (const networkSpeed of this.networkSpeedArray) {
      for (const cpuSlowdownMultiplier of this.cpuSlowdownMultiplierArray) {
        this.logger.logInfo(`cpuSlowdownMultiplier is ${cpuSlowdownMultiplier} and network speed is ${networkSpeed}`);
        const auditEngine = new ThrottledAuditEngine(this.webPageThrottledAuditConfiguration.webPage, this.webPageThrottledAuditConfiguration.webApplication, this.reportFolderFullPath, this.logger, this.throttledAuditGroupId, false, cpuSlowdownMultiplier, networkSpeed);
        await auditEngine.runAuditWithThrottling();
      }
    }
    return this.throttledAuditGroupId;
  }

  private async runWithExternalThrottling(): Promise<string> {
    const throttlingManager = new ThrottlingManager(this.logger);
    for (const networkSpeedItem of this.networkSpeedArray) {
      this.logger.logInfo(`nework item data @sitespeed.io/throttle throttling with options ${JSON.stringify(networkSpeedItem)}`);
      const throttleOptions = {
        up: networkSpeedItem.throughputKbps,
        down: networkSpeedItem.throughputKbps,
        rtt: networkSpeedItem.rttMs,
      };
      this.logger.logInfo(`option data @sitespeed.io/throttle throttling with options ${JSON.stringify(throttleOptions)}`);
      await throttlingManager.startThrottling(throttleOptions);
      for (const cpuSlowdownMultiplier of this.cpuSlowdownMultiplierArray) {
        this.logger.logInfo(`Starting analysis for cpu slowdown multiplier ${cpuSlowdownMultiplier} and network speed ${JSON.stringify(networkSpeedItem)}`);
        const auditEngine = new ThrottledAuditEngine(this.webPageThrottledAuditConfiguration.webPage, this.webPageThrottledAuditConfiguration.webApplication, this.reportFolderFullPath, this.logger, this.throttledAuditGroupId, true, cpuSlowdownMultiplier, networkSpeedItem);
        await auditEngine.runAuditWithThrottling();
      }
      this.logger.logInfo(`Stopping @sitespeed.io/throttle throttling with options ${JSON.stringify(throttleOptions)}`);
      await throttlingManager.stopThrottling();
    }
    return this.throttledAuditGroupId;
  }
}