import * as fs from 'fs';
import { CONSTANTS } from './Constants.js';

export class BaseReport {
    constructor(webPage,webApplication, reportFolder, logger) {
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;
        this.logger = logger;
    }

    createFoldersIfNotExist(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) throw err;
                this.logger.logInfo(`${folderPath} -- Folder created!`);
            });
        }
    }
    getReportFolderPath() {
        const folderPath = this.reportFolder;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getWebApplicationReportFolderPath() {
        const folderPath = `${this.getReportFolderPath()}/${this.webApplication.id}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    getWebPageWebPageFolderPath() {
        //create folders if they don't exist
        const folderPath = `${this.getWebApplicationReportFolderPath()}/${this.webPage.id}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getWebPageEnvironmentFolderPath() {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageWebPageFolderPath()}/${this.webPage.environment}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getWebPageEnvironmentChartDataFolderPath() {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.CHARTDATA}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getWebPageAuditFolderPath() {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.AUDIT}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
   
    getWebPageAuditReportFolderPath(throttledAuditGroupId) {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageAuditFolderPath()}/${throttledAuditGroupId}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }


    getWebPageAuditChartDataFolderPath(throttledAuditGroupId) {
        const folderPath = `${this.getWebPageAuditReportFolderPath(throttledAuditGroupId)}/${CONSTANTS.CHARTDATA}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    getAppReportAllResultsFilePath() {
        const filePath = `${this.reportFolder}/${this.webApplication.name}/${CONSTANTS.ALL_RESULTS_ALL_KEYS}`;
        return filePath;
    }

    getApplicationChartDataSpecificFilePath(key) {
        const filePath = `${this.getApplicationChartDataFolder()}/${key}.json`;
        return filePath;
    }
    getApplicationChartDataAllKeysFilePath() {
        const filePath = `${this.getWebApplicationReportFolderPath()}/${CONSTANTS.ALL_KEYS}`;
        return filePath;
    }
    getAppAuditListReportFilePath() {
        return `${this.getWebApplicationReportFolderPath()}/${this.webApplication.name}_${CONSTANTS.AUDITLIST}.json`;
    }

    getAppSummaryReportFilePath() {
        //create folders if they don't exist
        return `${this.getWebApplicationReportFolderPath()}/${this.webApplication.name}_${CONSTANTS.SUMMARY}.json`;
    }

    getAnalysisReportFilePath(throttledAuditGroupId, cpuSlowDownMultiplier, networkSpeed) {
        //create folders if they don't exist
        return `${this.getAnalysisListReportFolderPath(throttledAuditGroupId)}/${throttledAuditGroupId}_${CONSTANTS.CPU}_${cpuSlowDownMultiplier}_${CONSTANTS.NETWORK}_${networkSpeed.throughputKbps}.json`;
    }

    getChartDataReportFolderPath(throttledAuditGroupId) {
        //create folders if they don't exist
        var folderPath = `${this.getWebPageAuditReportFolderPath(throttledAuditGroupId)}/${CONSTANTS.CHARTDATA}`
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getThrottledAuditGroupThrottleImpactReportFilePath(throttledAuditGroupId) {
        //create folders if they don't exist
        var filePath = `${this.getChartDataReportFolderPath(throttledAuditGroupId)}/${CONSTANTS.WEB_PAGE_THROTTLED_AUDIT_THROTTLE_IMPACT_REPORT_FILE_NAME}`
        return filePath;
    }

}
