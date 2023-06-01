import * as fs from 'fs';
import { ThrottledAuditGroupSummaryChartDataModel } from './ThrottledAuditGroupSummaryChartDataModel.js';
import { ThrottledAuditGroupSummaryReport } from '../reports/ThrottledAuditGroupSummaryReport.js';
import { BaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';

export class ThrottledAuditGroupSummaryChartData extends BaseReport {
    constructor(webPage, webApplication, reportFolder, logger, throttledAuditGroupId) {
        super(webPage, webApplication, reportFolder, logger)
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.ThrottledAuditGroupSummaryReport = new ThrottledAuditGroupSummaryReport(webPage, webApplication, reportFolder, logger, throttledAuditGroupId);
        this.webPageThrottledAuditSummaryChartDataFilePath = this.getThrottledAuditGroupSummaryChartDataFilePath(throttledAuditGroupId);
    }
    getThrottledAuditGroupSummaryChartDataFilePath(throttledAuditGroupId) {
        //create folders if they don't exist
        return `${this.getWebPageAuditChartDataFolderPath(throttledAuditGroupId)}/${CONSTANTS.WEB_PAGE_THROTTLED_AUDIT_THROTTLE_IMPACT_CHART_DATA_FILE_NAME}`;
    }

    generate() {
        const auditSummaryDataJson = this.ThrottledAuditGroupSummaryReport.getReport();
        //const auditSummaryDataJson = this.getThrottledAuditGroupSummaryChartDataFilePath(this.throttledAuditGroupId);
        const chartData = this.processThrottlingData(auditSummaryDataJson.auditResultList);
        return this.saveReport(chartData);
    }

    getSessionSummaryInformation() {
        const auditSummaryPath = this.getThrottledAuditGroupSummaryChartDataFilePath(this.throttledAuditGroupId);
        const auditSummaryDataJson = JSON.parse(fs.readFileSync(auditSummaryPath, 'utf8'));
        return auditSummaryDataJson;
    }
    getReport() {
        //TODO - return as ThrottledAuditGroupSummaryChartDataModel
        const data = fs.readFileSync(this.webPageThrottledAuditSummaryChartDataFilePath, 'utf8');
        return JSON.parse(data);
    }
    saveReport(chartData) {
        fs.writeFileSync(this.webPageThrottledAuditSummaryChartDataFilePath, chartData.toJson());
    }

    processThrottlingData(auditResultList) {
        const webPageThrottledAuditSummaryChartDataList = { interactiveResult: {}, speedIndex: {} };
        const networkSpeedList = [];
        auditResultList.sort((a, b) => (a.networkThrottle.throughputKbps > b.networkThrottle.throughputKbps) ? 1 : -1);
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
        return new ThrottledAuditGroupSummaryChartDataModel(this.webPage,this.webApplication, this.throttledAuditGroupId, networkSpeedList, webPageThrottledAuditSummaryChartDataList);
    }
}
