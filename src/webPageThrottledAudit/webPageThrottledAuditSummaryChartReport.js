import * as fs from 'fs';
import { WebPageThrottledAuditThrottleImpactReportModel } from './WebPageThrottledAuditThrottleImpactReportModel.js';
import { BaseReport } from '../base/BaseReport.js';

export class WebPageThrottledAuditSummaryChartReport extends BaseReport {
    constructor(webApplication, reportFolder, logger,auditInstanceId) {
        super(webApplication, reportFolder, logger)
        this.auditInstanceId = auditInstanceId;
    }

    generate() {
        const auditSummaryDataJson = this.getSessionSummaryInformation(this.auditInstanceId);
        const webPageThrottledAuditThrottleImpactReportModelList = this.processThrottlingData(auditSummaryDataJson.auditResultList);
        return this.writeToFile(webPageThrottledAuditThrottleImpactReportModelList);
    }

    getSessionSummaryInformation() {
        const auditSummaryPath = this.getWebPageThrottledAuditSummaryReportFilePath(this.auditInstanceId);
        const auditSummaryDataJson = JSON.parse(fs.readFileSync(auditSummaryPath, 'utf8'));
        return auditSummaryDataJson;
    }

    writeToFile(webPageThrottledAuditThrottleImpactReportModelList) {
        const chartDataFilePath = this.getWebPageThrottledAuditThrottleImpactReportFilePath(this.auditInstanceId)
        fs.writeFileSync(chartDataFilePath, JSON.stringify(webPageThrottledAuditThrottleImpactReportModelList));
        this.logger.logInfo(`WebPageThrottledAuditThrottleImpactReportModel data file is created and path is ${chartDataFilePath}`);
        return chartDataFilePath;
    }

    processThrottlingData(auditResultList) {
        const WebPageThrottledAuditThrottleImpactReportModelList = { interactiveResult: {}, speedIndex: {} };
        const networkSpeedList = [];
        auditResultList.sort((a, b) => (a.networkThrottle > b.networkThrottle) ? 1 : -1);
        for (const analysisResult of auditResultList) {
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
        return new WebPageThrottledAuditThrottleImpactReportModel(this.webApplication, this.auditInstanceId,networkSpeedList, WebPageThrottledAuditThrottleImpactReportModelList);
    }
}
