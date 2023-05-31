import * as fs from 'fs';
import { BaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';
import {EnvironmentSpecificThrottleSettingChartDataModel} from './EnvironmentSpecificThrottleSettingChartDataModel.js';

export class EnvironmentSpecificThrottleSettingChartData extends BaseReport {
    constructor(webPage,webApplication,reportFolder, logger,  cpuSlowDownMultiplier, networkSpeed, labels, listOfDataSets) {
        super(webPage, webApplication, reportFolder, logger)
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.networkSpeed = networkSpeed;
        this.labels = labels;
        this.listOfDataSets = listOfDataSets;
        this.chartDataFilePath = this.getChartDataFilePath();
        
    }
    getChartDataFilePath() {
        //create folders if they don't exist
        return `${this.getWebPageEnvironmentChartDataFolderPath()}/cpu_${this.cpuSlowDownMultiplier}_${this.networkSpeed}_${CONSTANTS.WEB_PAGE_ENVIRONMENT_SPECIFIC_THROTTLE_SETTING_THROTTLE_IMPACT_CHART_DATA_FILE_NAME_SUFFIX}`;
    }

    generate() {
        const environmentSpecificThrottleSettingChartDataModel = new EnvironmentSpecificThrottleSettingChartDataModel(
            this.webPage,
            this.webApplication,
            this.cpuSlowDownMultiplier,
            this.networkSpeed,
            this.labels,
            this.listOfDataSets
        )
        return this.saveReport(environmentSpecificThrottleSettingChartDataModel);
    }
    
    getReport() {
        //TODO - return as WebPageThrottledAuditSummaryChartDataModel
        const data = fs.readFileSync(this.chartDataFilePath, 'utf8');
        return JSON.parse(data);
    }
    saveReport(chartData) {
        fs.writeFileSync(this.chartDataFilePath, chartData.toJson());
    }
}
