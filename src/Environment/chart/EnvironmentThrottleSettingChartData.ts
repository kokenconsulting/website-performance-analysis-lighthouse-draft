import * as fs from 'fs';
import { WebPageBaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';
import { EnvironmentThrottleSettingChartDataModel } from './EnvironmentThrottleSettingChartDataModel.js';
import { WebApplicationModel } from '../../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../../webPage/WebPageModel.js';
import { ProcessLogger } from '../../log/ProcessLogger.js';

export class EnvironmentThrottleSettingChartData extends WebPageBaseReport {
    private chartDataFilePath: string;

    constructor(
        webPage: WebPageModel,
        webApplication: WebApplicationModel,
        reportFolder: string,
        logger: ProcessLogger,
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