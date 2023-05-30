
import { LighthouseAuditEngine } from './LighthouseAuditEngine.js';
import { AuditReport } from './AuditReport.js';
import { EngineBase } from '../base/EngineBase.js';
export class AuditEngine extends EngineBase {
    constructor(webApplication, url, reportFolder, logger, auditInstanceId, isExternalThrottlingUsed, cpuSlowdownMultiplier, networkSpeed) {
        super(logger);
        this.webApplication = webApplication;
        this.url = url;
        this.reportFolder = reportFolder;
        this.auditInstanceId = auditInstanceId;
        var resettedNetworkSpeed  = {
            rttMs: 0,
            throughputKbps: 0
        };
        if (isExternalThrottlingUsed === true) {
            this.lighthouseEngine = new LighthouseAuditEngine(webApplication, reportFolder, logger, auditInstanceId, cpuSlowdownMultiplier, resettedNetworkSpeed,networkSpeed);
        }else{
            this.lighthouseEngine = new LighthouseAuditEngine(webApplication, reportFolder, logger, auditInstanceId, cpuSlowdownMultiplier, networkSpeed);
        }
    }

    async runAuditWithThrottling() {
        let jsonReport = null;
        this.logger.logInfo(`Starting Analysis Orchestration with Throttling. Session Id: ${this.auditInstanceId}`);
        this.logger.logInfo(`Session Id: ${this.auditInstanceId}, Cpu Slowdown Multiplier: ${cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(networkSpeed)}`);
        jsonReport = await this.lighthouseEngine.runLighthouse(this.url);
        this.logger.logInfo(`Analysis Orchestration - Lighthouse Analysis completed`);
        this.logger.logInfo(`Analysis Orchestration - Saving Lighthouse Analysis Report - Session Id: ${this.auditInstanceId}, Cpu Slowdown Multiplier: ${cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(networkSpeed)}`);
        var lighthouseReporter = new AuditReport(this.webApplication, this.reportFolder, this.logger, this.auditInstanceId, cpuSlowdownMultiplier, networkSpeed);
        lighthouseReporter.saveReport(jsonReport);
    }
}