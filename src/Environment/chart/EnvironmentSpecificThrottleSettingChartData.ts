import * as fs from 'fs';
import { WebPageBaseReport } from '../../Base/BaseReport.js';
import { CONSTANTS } from '../../Base/Constants.js';
import { EnvironmentSpecificThrottleSettingChartDataModel } from './EnvironmentSpecificThrottleSettingChartDataModel.js';
import { WebPageModel } from '../../WebPage/WebPageModel.js';
import { WebApplicationModel } from '../../WebApplication/WebApplicationModel.js';
import { ProcessLogger } from '../../Log/ProcessLogger.js';

export class EnvironmentSpecificThrottleSettingChartData extends WebPageBaseReport {
    private chartDataFilePath: string;

    constructor(
        webPage: WebPageModel,
        webApplication: WebApplicationModel,
        reportFolder: string,
        logger: ProcessLogger,
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