import * as fs from 'fs';
import { BaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';
import { EnvironmentThrottleSettingChartDataModel } from './EnvironmentThrottleSettingChartDataModel.js';

export class EnvironmentThrottleSettingChartData extends BaseReport {
    private chartDataFilePath: string;

    constructor(
        webPage: any,
        webApplication: any,
        reportFolder: string,
        logger: any,
        private cpuSlowDownMultiplierList: number[],
        private networkSpeedList: number[]
    ) {
        super(webPage, webApplication, reportFolder, logger);
        this.chartDataFilePath = this.getChartDataFilePath();
    }

    private getChartDataFilePath(): string {
        //create folders if they don't exist
        return `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.WEB_PAGE_ENVIRONMENT_THROTTLE_SETTINGS_FILE_NAME}`;
    }

    public generate(): void {
        const environmentSpecificThrottleSettingChartDataModel = new EnvironmentThrottleSettingChartDataModel(
            this.webPage,
            this.webApplication,
            this.cpuSlowDownMultiplierList,
            this.networkSpeedList
        );
        this.saveReport(environmentSpecificThrottleSettingChartDataModel);
    }

    public getReport(): any {
        //TODO - return as ThrottledAuditGroupSummaryChartDataModel
        const data = fs.readFileSync(this.chartDataFilePath, 'utf8');
        return JSON.parse(data);
    }

    private saveReport(chartData: EnvironmentThrottleSettingChartDataModel): void {
        fs.writeFileSync(this.chartDataFilePath, chartData.toJson());
    }
}