import * as fs from 'fs';
import { logInfo } from '../log/processlogger.js';
import { SessionThrottleImpactReportModel } from '../models/SessionThrottleImpactReportModelModel.js';
import { getAnalysisReportFileName, prepareChartDataFolderUnderApp, getSessionSummaryOutputPath } from '../utils/folder.js';
import * as path from 'path';

export class ThrottledSessionChartDataGenerator {
    constructor(sessionId,webApplication, reportFolder) {
        this.sessionId = sessionId;
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;

    }

    generate() {
        const sessionSummaryDataJson = this.getSessionSummaryInformation(this.sessionId);
        const SessionThrottleImpactReportModelList = this.processThrottlingData(sessionSummaryDataJson);
        this.writeToFile(chartDataFolder, sessionId, SessionThrottleImpactReportModelList);
    }

    getSessionSummaryInformation() {
        const sessionSummaryPath = getSessionSummaryOutputPath(this.webApplication, this.sessionId, this.reportFolder);
        const sessionSummaryDataJson = JSON.parse(fs.readFileSync(sessionSummaryPath, 'utf8'));
        return sessionSummaryDataJson;
    }

    writeToFile(chartDataFolder, SessionThrottleImpactReportModelList) {
        const chartDataFolder = prepareChartDataFolderUnderApp(this.webApplication, this.reportFolder);
        const chartDataFilePath = path.join(chartDataFolder, `${this.sessionId}_SessionThrottleImpactReportModel.json`);
        fs.writeFileSync(chartDataFilePath, JSON.stringify(SessionThrottleImpactReportModelList));
        logInfo(`SessionThrottleImpactReportModel data file is created and path is ${chartDataFilePath}`);
    }

    processThrottlingData(analysisResultList) {
        const SessionThrottleImpactReportModelList = { interactiveResult: {}, speedIndex: {} };
        const networkSpeedList = [];
        analysisResultList.sort((a, b) => (a.networkThrottle > b.networkThrottle) ? 1 : -1);
        for (const analysisResult of analysisResultList) {
            const cpuSlowDownMultiplierStringValue = analysisResult.cpuSlowDownMultiplier + "";
            if (!SessionThrottleImpactReportModelList.interactiveResult.hasOwnProperty(cpuSlowDownMultiplierStringValue)) {
                SessionThrottleImpactReportModelList.interactiveResult[cpuSlowDownMultiplierStringValue] = [];
            }
            if (!SessionThrottleImpactReportModelList.speedIndex.hasOwnProperty(cpuSlowDownMultiplierStringValue)) {
                SessionThrottleImpactReportModelList.speedIndex[cpuSlowDownMultiplierStringValue] = [];
            }
            SessionThrottleImpactReportModelList.interactiveResult[cpuSlowDownMultiplierStringValue].push(analysisResult.loadTimeInteractive);
            SessionThrottleImpactReportModelList.speedIndex[cpuSlowDownMultiplierStringValue].push(analysisResult.loadTimeSpeedIndex);
            if (!networkSpeedList.includes(analysisResult.networkThrottle)) {
                networkSpeedList.push(analysisResult.networkThrottle);
            }
        }
        return new SessionThrottleImpactReportModel(this.webApplication, networkSpeedList, SessionThrottleImpactReportModelList);
    }
}