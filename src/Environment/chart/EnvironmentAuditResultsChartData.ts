import * as fs from 'fs';
// import { EnvironmentAuditResultsChartDataModel } from './EnvironmentAuditResultsChartDataModel.js';
import { EnvironmentSpecificThrottleSettingChartData } from './EnvironmentSpecificThrottleSettingChartData.js';
import { EnvironmentThrottleSettingChartData } from './EnvironmentThrottleSettingChartData.js';
import { ThrottledAuditGroupSummaryReport } from '../../ThrottledAuditGroup/reports/ThrottledAuditGroupSummaryReport.js';
import { WebPageEnvironmentAuditListReport } from '../report/WebPageEnvironmentAuditListReport.js';
import { WebPageBaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';
import { ProcessLogger } from '../../Log/ProcessLogger.js';
import { WebPageModel } from '../../webPage/WebPageModel.js';
import { WebApplicationModel } from '../../webApplication/WebApplicationModel.js';

export class EnvironmentAuditResultsChartData extends WebPageBaseReport {
    private webPageThrottledAuditSummaryReport: WebPageEnvironmentAuditListReport;
    private chartDataFilePath: string;
    private allAuditResultList: any[];
    private environmentUnsortedCompleteAuditDetails: any;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, reportFolder: string, logger: ProcessLogger) {
        super(webPage, webApplication, reportFolder, logger);
        this.webPageThrottledAuditSummaryReport = new WebPageEnvironmentAuditListReport(webPage, webApplication, reportFolder, logger);
        this.chartDataFilePath = this.getReportFilePath();
        this.allAuditResultList = [];
        this.environmentUnsortedCompleteAuditDetails = {};
    }

    private getReportFilePath(): string {
        //create folders if they don't exist
        return `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.WEB_PAGE_ENVIRONMENT_THROTTLED_AUDIT_THROTTLE_IMPACT_CHART_DATA_FILE_NAME}`;
    }

    public async generate(): Promise<string | null> {
        this.getAllAuditDataForEnvironment();
        const chartData = this.processReportData();
        return this.saveReport(chartData);
    }

    private getAllAuditDataForEnvironment(): void {
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

    public getReport(): any {
        //TODO - return as ThrottledAuditGroupSummaryChartDataModel
        const data = fs.readFileSync(this.chartDataFilePath, 'utf8');
        return JSON.parse(data);
    }

    private saveReport(chartData: any): string {
        const json = JSON.stringify(chartData);
        fs.writeFileSync(this.chartDataFilePath, json);
        return this.chartDataFilePath;
    }

    private processReportData(): any {
        //sort this,allAuditResultList based on startDateTime property 
        this.sortAllAuditResultList();
        this.categoriseAllAuditData();
        //loop over this.environmentUnsortedCompleteAuditDetails (key,value)
        this.generateSpecificThrottledSettingChartData();
        return this.environmentUnsortedCompleteAuditDetails;
    }

    private sortAllAuditResultList(): void {
        this.allAuditResultList.sort((a, b) => {
            return a.startDateTime - b.startDateTime;
        });
    }

    private categoriseAllAuditData(): void {
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

    private generateSpecificThrottledSettingChartData(): void {
        const cpuSlowDownMultiplierList: number[] = [];
        const networkSpeedList: number[] = [];
        for (const [key, value] of Object.entries<any>(this.environmentUnsortedCompleteAuditDetails)) {
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