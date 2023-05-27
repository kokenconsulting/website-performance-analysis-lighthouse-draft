import { LighthouseEngine } from './LighthouseEngine.js';
import {LighthouseAnalysisReport} from './LighthouseAnalysisReport.js';

export class AnalysisEngine extends LighthouseEngine {
    constructor(appInfo, url, reportFolder,logger,sessionId) {
        super(logger);
        this.appInfo = appInfo;
        this.url = url;
        this.reportFolder = reportFolder;
        this.sessionId = sessionId;
    }

    async orchestrateAnalysisWithThrottling(isExternalThrottlingUsed, networkSpeed, cpuSlowdownMultiplier) {
        let jsonReport = null;
        this.logger.logInfo(`Starting Analysis Orchestration with Throttling. Session Id: ${sessionId}`);
        if (isExternalThrottlingUsed === true) {
            var resettedNetworkSpeed = {
                rttMs: 0,
                throughputKbps: 0
            }
            this.logger.logInfo(`Analysis Orchestration - External Throttling used`);
            jsonReport = await this.runLighthouse(this.url, resettedNetworkSpeed, cpuSlowdownMultiplier, networkSpeed);
        } else {
            this.logger.logInfo(`Analysis Orchestration - Lighthouse Built In Throttling used`);
            jsonReport = await this.runLighthouse(this.url, networkSpeed, cpuSlowdownMultiplier);
        }

        var lighthouseReporter = new LighthouseAnalysisReport(appInfo,reportFolder,sessionId,cpuSlowdownMultiplier,networkSpeed);
        lighthouseReporter.saveReport(jsonReport);
    }
}