import * as fs from 'fs';
import { WebPageThrottledAuditSummaryChartDataModel } from './WebPageThrottledAuditSummaryChartDataModel.js';
import { WebPageThrottledAuditSummaryReport } from '../reports/WebPageThrottledAuditSummaryReport.js';
import { BaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';

export class WebPageThrottledAuditSummaryChartData extends BaseReport {
    constructor(webPage, webApplication, reportFolder, logger, auditInstanceId) {
        super(webPage, webApplication, reportFolder, logger)
        this.auditInstanceId = auditInstanceId;
        this.WebPageThrottledAuditSummaryReport = new WebPageThrottledAuditSummaryReport(webPage, webApplication, reportFolder, logger, auditInstanceId);
        this.webPageThrottledAuditSummaryChartDataFilePath = this.getWebPageThrottledAuditSummaryChartDataFilePath(auditInstanceId);
    }
    getWebPageThrottledAuditSummaryChartDataFilePath(auditInstanceId) {
        //create folders if they don't exist
        return `${this.getWebPageAuditChartDataFolderPath(auditInstanceId)}/${CONSTANTS.WEB_PAGE_THROTTLED_AUDIT_THROTTLE_IMPACT_CHART_DATA_FILE_NAME}`;
    }

    generate() {
        const auditSummaryDataJson = this.WebPageThrottledAuditSummaryReport.getReport();
        //const auditSummaryDataJson = this.getWebPageThrottledAuditSummaryChartDataFilePath(this.auditInstanceId);
        const chartData = this.processThrottlingData(auditSummaryDataJson.auditResultList);
        return this.saveReport(chartData);
    }

    getSessionSummaryInformation() {
        const auditSummaryPath = this.getWebPageThrottledAuditSummaryChartDataFilePath(this.auditInstanceId);
        const auditSummaryDataJson = JSON.parse(fs.readFileSync(auditSummaryPath, 'utf8'));
        return auditSummaryDataJson;
    }
    getReport() {
        //TODO - return as WebPageThrottledAuditSummaryChartDataModel
        const data = fs.readFileSync(this.webPageThrottledAuditSummaryChartDataFilePath, 'utf8');
        return JSON.parse(data);
    }
    saveReport(chartData) {
        fs.writeFileSync(this.webPageThrottledAuditSummaryChartDataFilePath, chartData.toJson());
    }

    processThrottlingData(auditResultList) {
        const webPageThrottledAuditSummaryChartDataList = { interactiveResult: {}, speedIndex: {} };
        const networkSpeedList = [];
        auditResultList.sort((a, b) => (a.networkThrottle > b.networkThrottle) ? 1 : -1);
        for (const analysisResult of auditResultList) {
            const cpuSlowDownMultiplierStringValue = analysisResult.cpuSlowDownMultiplier + "";
            if (!webPageThrottledAuditSummaryChartDataList.interactiveResult.hasOwnProperty(cpuSlowDownMultiplierStringValue)) {
                webPageThrottledAuditSummaryChartDataList.interactiveResult[cpuSlowDownMultiplierStringValue] = [];
            }
            if (!webPageThrottledAuditSummaryChartDataList.speedIndex.hasOwnProperty(cpuSlowDownMultiplierStringValue)) {
                webPageThrottledAuditSummaryChartDataList.speedIndex[cpuSlowDownMultiplierStringValue] = [];
            }
            webPageThrottledAuditSummaryChartDataList.interactiveResult[cpuSlowDownMultiplierStringValue].push(analysisResult.loadTimeInteractive);
            webPageThrottledAuditSummaryChartDataList.speedIndex[cpuSlowDownMultiplierStringValue].push(analysisResult.loadTimeSpeedIndex);
            if (!networkSpeedList.includes(analysisResult.networkThrottle.throughputKbps)) {
                networkSpeedList.push(analysisResult.networkThrottle.throughputKbps);
            }
        }
        return new WebPageThrottledAuditSummaryChartDataModel(this.webPage,this.webApplication, this.auditInstanceId, networkSpeedList, webPageThrottledAuditSummaryChartDataList);
    }
}
