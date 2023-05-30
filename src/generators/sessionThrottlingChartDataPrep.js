import * as fs from 'fs';
import { logInfo } from '../log/processlogger.js';
import { WebPageThrottledAuditThrottleImpactReportModel } from '../models/WebPageThrottledAuditThrottleImpactReportModelModel.js';
import { getAnalysisReportFileName, prepareChartDataFolderUnderApp, getSessionSummaryOutputPath } from '../utils/folder.js';
import * as path from 'path';

export class ThrottledSessionChartDataGenerator {
    constructor(auditInstanceId,webApplication, reportFolder) {
        this.auditInstanceId = auditInstanceId;
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;

    }

    generate() {
        const sessionSummaryDataJson = this.getSessionSummaryInformation(this.auditInstanceId);
        const WebPageThrottledAuditThrottleImpactReportModelList = this.processThrottlingData(sessionSummaryDataJson);
        this.writeToFile(chartDataFolder, auditInstanceId, WebPageThrottledAuditThrottleImpactReportModelList);
    }

    getSessionSummaryInformation() {
        const sessionSummaryPath = getSessionSummaryOutputPath(this.webApplication, this.auditInstanceId, this.reportFolder);
        const sessionSummaryDataJson = JSON.parse(fs.readFileSync(sessionSummaryPath, 'utf8'));
        return sessionSummaryDataJson;
    }

    writeToFile(chartDataFolder, WebPageThrottledAuditThrottleImpactReportModelList) {
        const chartDataFolder = prepareChartDataFolderUnderApp(this.webApplication, this.reportFolder);
        const chartDataFilePath = path.join(chartDataFolder, `${this.auditInstanceId}_WebPageThrottledAuditThrottleImpactReportModel.json`);
        fs.writeFileSync(chartDataFilePath, JSON.stringify(WebPageThrottledAuditThrottleImpactReportModelList));
        logInfo(`WebPageThrottledAuditThrottleImpactReportModel data file is created and path is ${chartDataFilePath}`);
    }

    processThrottlingData(analysisResultList) {
        const WebPageThrottledAuditThrottleImpactReportModelList = { interactiveResult: {}, speedIndex: {} };
        const networkSpeedList = [];
        analysisResultList.sort((a, b) => (a.networkThrottle > b.networkThrottle) ? 1 : -1);
        for (const analysisResult of analysisResultList) {
            const cpuSlowDownMultiplierStringValue = analysisResult.cpuSlowDownMultiplier + "";
            if (!WebPageThrottledAuditThrottleImpactReportModelList.interactiveResult.hasOwnProperty(cpuSlowDownMultiplierStringValue)) {
                WebPageThrottledAuditThrottleImpactReportModelList.interactiveResult[cpuSlowDownMultiplierStringValue] = [];
            }
            if (!WebPageThrottledAuditThrottleImpactReportModelList.speedIndex.hasOwnProperty(cpuSlowDownMultiplierStringValue)) {
                WebPageThrottledAuditThrottleImpactReportModelList.speedIndex[cpuSlowDownMultiplierStringValue] = [];
            }
            WebPageThrottledAuditThrottleImpactReportModelList.interactiveResult[cpuSlowDownMultiplierStringValue].push(analysisResult.loadTimeInteractive);
            WebPageThrottledAuditThrottleImpactReportModelList.speedIndex[cpuSlowDownMultiplierStringValue].push(analysisResult.loadTimeSpeedIndex);
            if (!networkSpeedList.includes(analysisResult.networkThrottle)) {
                networkSpeedList.push(analysisResult.networkThrottle);
            }
        }
        return new WebPageThrottledAuditThrottleImpactReportModel(this.webApplication, networkSpeedList, WebPageThrottledAuditThrottleImpactReportModelList);
    }
}