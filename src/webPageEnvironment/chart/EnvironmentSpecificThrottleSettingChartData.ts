import * as fs from 'fs';
import { BaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';
import { EnvironmentSpecificThrottleSettingChartDataModel } from './EnvironmentSpecificThrottleSettingChartDataModel.js';

export class EnvironmentSpecificThrottleSettingChartData extends BaseReport {
    private chartDataFilePath: string;

    constructor(
        webPage: any,
        webApplication: any,
        reportFolder: string,
        logger: any,
        private cpuSlowDownMultiplier: number,
        private networkSpeed: number,
        private labels: string[],
        private listOfDataSets: any
    ) {
        super(webPage, webApplication, reportFolder, logger);
        this.chartDataFilePath = this.getChartDataFilePath();
    }

    private getChartDataFilePath(): string {
        //create folders if they don't exist
        return `${this.getWebPageEnvironmentChartDataFolderPath()}/cpu_${this.cpuSlowDownMultiplier}_${this.networkSpeed}_${CONSTANTS.WEB_PAGE_ENVIRONMENT_SPECIFIC_THROTTLE_SETTING_THROTTLE_IMPACT_CHART_DATA_FILE_NAME_SUFFIX}`;
    }

    public generate(): void {
        const environmentSpecificThrottleSettingChartDataModel = new EnvironmentSpecificThrottleSettingChartDataModel(
            this.webPage,
            this.webApplication,
            this.cpuSlowDownMultiplier,
            this.networkSpeed,
            this.labels,
            this.listOfDataSets
        );
        this.saveReport(environmentSpecificThrottleSettingChartDataModel);
    }

    public getReport(): any {
        //TODO - return as ThrottledAuditGroupSummaryChartDataModel
        const data = fs.readFileSync(this.chartDataFilePath, 'utf8');
        return JSON.parse(data);
    }

    private saveReport(chartData: EnvironmentSpecificThrottleSettingChartDataModel): void {
        fs.writeFileSync(this.chartDataFilePath, chartData.toJson());
    }
}