import * as fs from 'fs';
import { EnvironmentAuditResultsChartDataModel } from './EnvironmentAuditResultsChartDataModel.js';
import { EnvironmentSpecificThrottleSettingChartData } from './EnvironmentSpecificThrottleSettingChartData.js';
import { EnvironmentThrottleSettingChartData } from './EnvironmentThrottleSettingChartData.js';
import { ThrottledAuditGroupSummaryReport } from '../../ThrottledAuditGroup/reports/ThrottledAuditGroupSummaryReport.js';
import { WebPageEnvironmentAuditListReport } from '../report/WebPageEnvironmentAuditListReport.js';
import { BaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';

export class EnvironmentAuditResultsChartData extends BaseReport {
    constructor(webPage, webApplication, reportFolder, logger) {
        super(webPage, webApplication, reportFolder, logger)
        this.webPageThrottledAuditSummaryReport = new WebPageEnvironmentAuditListReport(webPage, webApplication, reportFolder, logger);
        this.chartDataFilePath = this.getReportFilePath();
        this.allAuditResultList = [];
        this.environmentUnsortedCompleteAuditDetails = {};
    }
    getReportFilePath() {
        //create folders if they don't exist
        return `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.WEB_PAGE_ENVIRONMENT_THROTTLED_AUDIT_THROTTLE_IMPACT_CHART_DATA_FILE_NAME}`;
    }

    generate() {
        this.getAllAuditDataForEnvironment();
        const chartData = this.processReportData();
        return this.saveReport(chartData);
    }

    getAllAuditDataForEnvironment() {
        const auditSummaryReport = this.webPageThrottledAuditSummaryReport.getReport();
        const auditList = auditSummaryReport.auditResultList;
        for (const audit of auditList) {
            this.logger.logInfo(`EnvironmentAuditResultsChartData - Processing audit ${audit}`);
            this.logger.logInfo(`EnvironmentAuditResultsChartData - Processing audit ${audit.throttledAuditGroupId}`);
            const reporter = new ThrottledAuditGroupSummaryReport(this.webPage, this.webApplication, this.reportFolder, this.logger, audit);
            const auditSummary = reporter.getReport();
            const auditListArray = auditSummary.auditResultList;
            for (const auditItem of auditListArray) {
                this.allAuditResultList.push(auditItem);
            }
        }
    }

    getSessionSummaryInformation() {
        const auditSummaryPath = this.getReportFilePath(this.throttledAuditGroupId);
        const auditSummaryDataJson = JSON.parse(fs.readFileSync(auditSummaryPath, 'utf8'));
        return auditSummaryDataJson;
    }
    getReport() {
        //TODO - return as ThrottledAuditGroupSummaryChartDataModel
        const data = fs.readFileSync(this.chartDataFilePath, 'utf8');
        return JSON.parse(data);
    }
    saveReport() {
        const json = JSON.stringify(this.environmentUnsortedCompleteAuditDetails);
        fs.writeFileSync(this.chartDataFilePath, json);
    }

    processReportData() {
        //sort this,allAuditResultList based on startDateTime property 
        this.sortAllAuditResultList();
        this.categoriseAllAuditData();
        //loop over this.environmentUnsortedCompleteAuditDetails (key,value)
        this.generateSpecificThrottledSettingChartData();
    }

    sortAllAuditResultList() {
        this.allAuditResultList.sort((a, b) => {
            return a.startDateTime - b.startDateTime;
        });
    }



    categoriseAllAuditData() {
        for (const auditDetail of this.allAuditResultList) {
            var key = `${auditDetail.cpuSlowDownMultiplier}_${auditDetail.networkThrottle.throughputKbps}`;
            //if  environmentUnsortedCompleteAuditDetails[key] does not exists, then create an array under environmentUnsortedCompleteAuditDetails[key]
            if (!this.environmentUnsortedCompleteAuditDetails[key]) {
                this.environmentUnsortedCompleteAuditDetails[key] = {
                    cpuSlowDownMultiplier: auditDetail.cpuSlowDownMultiplier,
                    networkThrottle: auditDetail.networkThrottle.throughputKbps,
                    labels: [],
                    interactive: [],
                    speedindex: []
                };

            }
            this.environmentUnsortedCompleteAuditDetails[key].labels.push(`${auditDetail.startDateTime}-${auditDetail.throttledAuditGroupId}`);
            this.environmentUnsortedCompleteAuditDetails[key].interactive.push(auditDetail.loadTimeInteractive);
            this.environmentUnsortedCompleteAuditDetails[key].speedindex.push(auditDetail.loadTimeSpeedIndex);
        }
    }

    generateSpecificThrottledSettingChartData() {
        const cpuSlowDownMultiplierList = [];
        const networkSpeedList = [];
        for (const [key, value] of Object.entries(this.environmentUnsortedCompleteAuditDetails)) {

            if (cpuSlowDownMultiplierList.indexOf(value.cpuSlowDownMultiplier) === -1) {
                cpuSlowDownMultiplierList.push(value.cpuSlowDownMultiplier);
            }
            if (networkSpeedList.indexOf(value.networkThrottle) === -1) {
                networkSpeedList.push(value.networkThrottle);
            }

            const cpuSlowDownMultiplier = value.cpuSlowDownMultiplier;
            const networkThrottle = value.networkThrottle;
            const labels = value.labels;
            const interactive = value.interactive;
            const speedindex = value.speedindex;
            const dataSets = {
                interactive: interactive,
                speedindex: speedindex
            };
            var specificThrottleSettingChartData = new EnvironmentSpecificThrottleSettingChartData(this.webPage, this.webApplication, this.reportFolder, this.logger, cpuSlowDownMultiplier, networkThrottle, labels, dataSets);
            specificThrottleSettingChartData.generate();
        }
        //sort cpuSlowDownMultiplierList
        cpuSlowDownMultiplierList.sort((a, b) => {
            return a - b;
        });
        //sort networkSpeedList
        networkSpeedList.sort((a, b) => {
            return a - b;
        });
        const environmentThrottleSettingChartData = new EnvironmentThrottleSettingChartData(this.webPage, this.webApplication, this.reportFolder, this.logger, cpuSlowDownMultiplierList, networkSpeedList);
        environmentThrottleSettingChartData.generate();
    }
}
