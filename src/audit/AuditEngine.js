
import { LighthouseAuditEngine } from '../lighthouse/LighthouseAuditEngine.js'
import { AuditReport } from './AuditReport.js';
import { EngineBase } from '../base/EngineBase.js';
export class AuditEngine extends EngineBase {
    constructor(webPage,webApplication,  reportFolder, logger, auditInstanceId, isExternalThrottlingUsed, cpuSlowdownMultiplier, networkSpeed) {
        super(logger);
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;
        this.auditInstanceId = auditInstanceId;
        this.networkSpeed = networkSpeed;
        this.cpuSlowdownMultiplier = cpuSlowdownMultiplier;
        var resettedNetworkSpeed  = {
            rttMs: 0,
            throughputKbps: 0
        };
        if (isExternalThrottlingUsed === true) {
            this.lighthouseEngine = new LighthouseAuditEngine(this.webPage,webApplication, reportFolder, logger, auditInstanceId, cpuSlowdownMultiplier, resettedNetworkSpeed,networkSpeed);
        }else{
            this.lighthouseEngine = new LighthouseAuditEngine(this.webPage,webApplication, reportFolder, logger, auditInstanceId, cpuSlowdownMultiplier, networkSpeed);
        }
    }

    async runAuditWithThrottling() {
        let jsonReport = null;
        this.logger.logInfo(`Starting Analysis Orchestration with Throttling. Session Id: ${this.auditInstanceId}`);
        this.logger.logInfo(`Session Id: ${this.auditInstanceId}, Cpu Slowdown Multiplier: ${this.cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(this.networkSpeed)}`);
        await this.lighthouseEngine.run();
        this.logger.logInfo(`Analysis Orchestration - Lighthouse Analysis completed`);
        this.logger.logInfo(`Analysis Orchestration - Saving Lighthouse Analysis Report - Session Id: ${this.auditInstanceId}, Cpu Slowdown Multiplier: ${this.cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(this.networkSpeed)}`);
        
        var auditReporter = new AuditReport(this.webPage,this.webApplication, this.reportFolder, this.logger, this.auditInstanceId, this.cpuSlowdownMultiplier, this.networkSpeed);
        auditReporter.generate()
    }
}