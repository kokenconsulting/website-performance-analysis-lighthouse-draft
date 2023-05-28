import * as fs from 'fs';
import { CONSTANTS } from './Constants.js';

export class BaseReport {
    constructor(appInfo, reportFolder, logger) {
        this.reportFolder = reportFolder;
        this.appInfo = appInfo;
        this.logger = logger;
    }

    createFoldersIfNotExist(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) throw err;
                this.logger.logInfo('Folder created!');
            });
        }
    }
    getAppReportFolderPath() {
        const folderPath = `${this.reportFolder}/${this.appInfo.projectName}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getAppSessionListReportFilePath() {
        return `${this.getAppReportFolderPath()}/${this.appInfo.projectName}_${CONSTANTS.SESSIONLIST}.json`;
    }

    getAppSummaryReportFilePath() {
        //create folders if they don't exist
        return `${this.getAppReportFolderPath()}/${this.appInfo.projectName}_${CONSTANTS.SUMMARY}.json`;
    }
    getSessionReportFolderPath(sessionId) {
        //create folders if they don't exist
        const folderPath = `${this.getAppReportFolderPath()}/${CONSTANTS.SESSION}/${sessionId}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    getAnalysisListReportFolderPath(sessionId) {
        //create folders if they don't exist
        var folderPath = `${this.getSessionReportFolderPath(sessionId)}/${CONSTANTS.ANALYSIS}`
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    getSessionSummaryReportFilePath(sessionId) {
        //create folders if they don't exist
        return `${this.getSessionReportFolderPath(sessionId)}/${sessionId}_${CONSTANTS.SUMMARY}.json`;
    }

    getAnalysisReportFilePath(sessionId, cpuSlowDownMultiplier, networkSpeed) {
        //create folders if they don't exist
        return `${this.getAnalysisListReportFolderPath(sessionId)}/${sessionId}_${CONSTANTS.CPU}_${cpuSlowDownMultiplier}_${CONSTANTS.NETWORK}_${networkSpeed.throughputKbps}.json`;
    }
}
