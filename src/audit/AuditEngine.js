
import { LighthouseEngine } from './LighthouseEngine.js';
import { LighthouseAuditReport } from './LighthouseAuditReport.js';
import { AuditBase } from '../base/AuditBase.js';
export class AuditEngine extends AuditBase {
    constructor(webApplication, url, reportFolder, logger, auditInstanceId) {
        super(logger);
        this.webApplication = webApplication;
        this.url = url;
        this.reportFolder = reportFolder;
        this.auditInstanceId = auditInstanceId;
        this.lighthouseEngine = new LighthouseEngine(this.logger);
    }
   
    getAuditInstanceId() {
        return this.auditInstanceId;
      }
    async orchestrateAnalysisWithThrottling(isExternalThrottlingUsed, cpuSlowdownMultiplier,networkSpeed) {
        let jsonReport = null;
        this.logger.logInfo(`Starting Analysis Orchestration with Throttling. Session Id: ${this.auditInstanceId}`);
        this.logger.logInfo(`Session Id: ${this.auditInstanceId}, Cpu Slowdown Multiplier: ${cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(networkSpeed)}`);
        if (isExternalThrottlingUsed === true) {
            var resettedNetworkSpeed = {
                rttMs: 0,
                throughputKbps: 0
            }
            this.logger.logInfo(`Analysis Orchestration - External Throttling used`);
            jsonReport = await this.lighthouseEngine.runLighthouse(this.url, resettedNetworkSpeed, cpuSlowdownMultiplier, networkSpeed);
        } else {
            this.logger.logInfo(`Analysis Orchestration - Lighthouse Built In Throttling used`);
            jsonReport = await this.lighthouseEngine.runLighthouse(this.url, networkSpeed, cpuSlowdownMultiplier);
        }
        this.logger.logInfo(`Analysis Orchestration - Lighthouse Analysis completed`);
        this.logger.logInfo(`Analysis Orchestration - Saving Lighthouse Analysis Report`);
        this.logger.logInfo(`Analysis Orchestration - Saving Lighthouse Analysis Report - Session Id: ${this.auditInstanceId}, Cpu Slowdown Multiplier: ${cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(networkSpeed)}`);

        var lighthouseReporter = new LighthouseAuditReport(this.webApplication, this.reportFolder, this.logger,this.auditInstanceId, cpuSlowdownMultiplier, networkSpeed);
        lighthouseReporter.saveReport(jsonReport);
    }
}