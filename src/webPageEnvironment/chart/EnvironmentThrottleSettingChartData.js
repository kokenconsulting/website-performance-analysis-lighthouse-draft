import * as fs from 'fs';
import { BaseReport } from '../../base/BaseReport.js';
import { CONSTANTS } from '../../base/Constants.js';
import {EnvironmentThrottleSettingChartDataModel} from './EnvironmentThrottleSettingChartDataModel.js';

export class EnvironmentThrottleSettingChartData extends BaseReport {
    constructor(webPage,webApplication,reportFolder, logger,  cpuSlowDownMultiplierList, networkSpeedList) {
        super(webPage, webApplication, reportFolder, logger)
        this.cpuSlowDownMultiplierList = cpuSlowDownMultiplierList;
        this.networkSpeedList = networkSpeedList;
        this.chartDataFilePath = this.getChartDataFilePath();
        
    }
    getChartDataFilePath() {
        //create folders if they don't exist
        return `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.WEB_PAGE_ENVIRONMENT_THROTTLE_SETTINGS_FILE_NAME}`;
    }

    generate() {
        const environmentSpecificThrottleSettingChartDataModel = new EnvironmentThrottleSettingChartDataModel(
            this.webPage,
            this.webApplication,
            this.cpuSlowDownMultiplierList,
            this.networkSpeedList,
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
