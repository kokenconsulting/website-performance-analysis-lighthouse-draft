import { LighthouseAuditEngine } from '../lighthouse/LighthouseAuditEngine_2';
import { ThrottledAuditReport } from './ThrottledAuditReport.js';
import { EngineBase } from '../base/EngineBase';

export class ThrottledAuditEngine extends EngineBase {
    private webPage: any;
    private webApplication: any;
    private reportFolder: string;
    private throttledAuditGroupId: string;
    private networkSpeed: any;
    private cpuSlowdownMultiplier: number;
    private lighthouseEngine: LighthouseAuditEngine;

    constructor(webPage: any, webApplication: any, reportFolder: string, logger: any, throttledAuditGroupId: string, isExternalThrottlingUsed: boolean, cpuSlowdownMultiplier: number, networkSpeed: any) {
        super(logger);
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.networkSpeed = networkSpeed;
        this.cpuSlowdownMultiplier = cpuSlowdownMultiplier;
        const resettedNetworkSpeed = {
            rttMs: 0,
            throughputKbps: 0
        };
        if (isExternalThrottlingUsed === true) {
            this.lighthouseEngine = new LighthouseAuditEngine(this.webPage, webApplication, reportFolder, logger, throttledAuditGroupId, cpuSlowdownMultiplier, resettedNetworkSpeed, networkSpeed);
        } else {
            this.lighthouseEngine = new LighthouseAuditEngine(this.webPage, webApplication, reportFolder, logger, throttledAuditGroupId, cpuSlowdownMultiplier, networkSpeed);
        }
    }

    public async runAuditWithThrottling(): Promise<void> {
        let jsonReport = null;
        this.logger.logInfo(`Starting Analysis Orchestration with Throttling. Session Id: ${this.throttledAuditGroupId}`);
        this.logger.logInfo(`Session Id: ${this.throttledAuditGroupId}, Cpu Slowdown Multiplier: ${this.cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(this.networkSpeed)}`);
        await this.lighthouseEngine.run();
        this.logger.logInfo(`Analysis Orchestration - Lighthouse Analysis completed`);
        this.logger.logInfo(`Analysis Orchestration - Saving Lighthouse Analysis Report - Session Id: ${this.throttledAuditGroupId}, Cpu Slowdown Multiplier: ${this.cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(this.networkSpeed)}`);

        const auditReporter = new ThrottledAuditReport(this.webPage, this.webApplication, this.reportFolder, this.logger, this.throttledAuditGroupId, this.cpuSlowdownMultiplier, this.networkSpeed);
        auditReporter.generate();
    }
}