
import { LighthouseEngine } from './LighthouseEngine.js';
import { LighthouseAnalysisReport } from './LighthouseAnalysisReport.js';
import { BaseEngine } from '../base/BaseEngine.js';
export class AnalysisEngine extends BaseEngine {
    constructor(webApplication, url, reportFolder, logger, sessionId) {
        super(logger);
        this.webApplication = webApplication;
        this.url = url;
        this.reportFolder = reportFolder;
        this.sessionId = sessionId;
        this.lighthouseEngine = new LighthouseEngine(this.logger);
    }
   
    getSessionId() {
        return this.sessionId;
      }
    async orchestrateAnalysisWithThrottling(isExternalThrottlingUsed, cpuSlowdownMultiplier,networkSpeed) {
        let jsonReport = null;
        this.logger.logInfo(`Starting Analysis Orchestration with Throttling. Session Id: ${this.sessionId}`);
        this.logger.logInfo(`Session Id: ${this.sessionId}, Cpu Slowdown Multiplier: ${cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(networkSpeed)}`);
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
        this.logger.logInfo(`Analysis Orchestration - Saving Lighthouse Analysis Report - Session Id: ${this.sessionId}, Cpu Slowdown Multiplier: ${cpuSlowdownMultiplier}, Network Speed: ${JSON.stringify(networkSpeed)}`);

        var lighthouseReporter = new LighthouseAnalysisReport(this.webApplication, this.reportFolder, this.logger,this.sessionId, cpuSlowdownMultiplier, networkSpeed);
        lighthouseReporter.saveReport(jsonReport);
    }
}