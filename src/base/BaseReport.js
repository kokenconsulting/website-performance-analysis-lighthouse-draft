import * as fs from 'fs';
import { CONSTANTS } from './Constants.js';

export class BaseReport {
    constructor(webApplication, reportFolder, logger) {
        this.reportFolder = reportFolder;
        this.webApplication = webApplication;
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
    getAppReportFolderPath() {
        const folderPath = `${this.reportFolder}/${this.webApplication.name}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getAppReportAllResultsFilePath() {
        const folderPath = `${this.reportFolder}/${this.webApplication.name}/${CONSTANTS.ALL_RESULTS_ALL_KEYS}`;
        return folderPath;
    }
    getApplicationChartDataFolder() {
        const folderPath = `${this.reportFolder}/${this.webApplication.name}/${CONSTANTS.CHARTDATA}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getApplicationChartDataSpecificFilePath(key) {
        const filePath = `${this.getApplicationChartDataFolder()}/${key}.json`;
        return filePath;
    }
    getApplicationChartDataAllKeysFilePath() {
        const filePath = `${this.getAppReportFolderPath()}/${CONSTANTS.ALL_KEYS}`;
        return filePath;
    }
    getAppAuditListReportFilePath() {
        return `${this.getAppReportFolderPath()}/${this.webApplication.name}_${CONSTANTS.AUDITLIST}.json`;
    }

    getAppSummaryReportFilePath() {
        //create folders if they don't exist
        return `${this.getAppReportFolderPath()}/${this.webApplication.name}_${CONSTANTS.SUMMARY}.json`;
    }
    getSessionReportFolderPath(auditInstanceId) {
        //create folders if they don't exist
        const folderPath = `${this.getAuditFolderPath()}/${auditInstanceId}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getAuditFolderPath() {
        //create folders if they don't exist
        const folderPath = `${this.getAppReportFolderPath()}/${CONSTANTS.AUDIT}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    getAnalysisListReportFolderPath(auditInstanceId) {
        //create folders if they don't exist
        var folderPath = `${this.getSessionReportFolderPath(auditInstanceId)}/${CONSTANTS.ANALYSIS}`
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    getWebPageThrottledAuditSummaryReportFilePath(auditInstanceId) {
        //create folders if they don't exist
        return `${this.getSessionReportFolderPath(auditInstanceId)}/${auditInstanceId}_${CONSTANTS.SUMMARY}.json`;
    }

    getAnalysisReportFilePath(auditInstanceId, cpuSlowDownMultiplier, networkSpeed) {
        //create folders if they don't exist
        return `${this.getAnalysisListReportFolderPath(auditInstanceId)}/${auditInstanceId}_${CONSTANTS.CPU}_${cpuSlowDownMultiplier}_${CONSTANTS.NETWORK}_${networkSpeed.throughputKbps}.json`;
    }

    getChartDataReportFolderPath(auditInstanceId) {
        //create folders if they don't exist
        var folderPath = `${this.getSessionReportFolderPath(auditInstanceId)}/${CONSTANTS.CHARTDATA}`
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getWebPageThrottledAuditThrottleImpactReportFilePath(auditInstanceId) {
        //create folders if they don't exist
        var filePath = `${this.getChartDataReportFolderPath(auditInstanceId)}/${CONSTANTS.WEB_PAGE_THROTTLED_AUDIT_THROTTLE_IMPACT_REPORT_FILE_NAME}`
        return filePath;
    }

}
