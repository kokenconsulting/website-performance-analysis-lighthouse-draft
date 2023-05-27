import * as fs from 'fs';
import { CONSTANTS } from './Constants.js';

export class BaseReport {
    constructor(appInfo, reportFolder) {
        this.reportFolder = reportFolder;
        this.appInfo = appInfo;
    }

    createFoldersIfNotExist(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) throw err;
                console.log('Folder created!');
            });
        }
    }
    getAppReportFolderPath() {
        const folderPath = `${this.reportFolder}/${this.appInfo.appName}`;
        createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getAppSessionListReportFilePath(){
        return `${this.getAppReportFolderPath()}/${this.appInfo.appName}_${CONSTANTS.SESSIONLIST}.json`;
    }

    getAppSummaryReportFilePath() {
        //create folders if they don't exist
        return `${this.getAppReportFolderPath()}/${this.appInfo.appName}_${CONSTANTS.SUMMARY}.json`;
    }
    getSessionReportFolderPath(sessionId) {
        //create folders if they don't exist
        const folderPath = `${this.getAppReportFolderPath()}/${CONSTANTS.SESSION}/${sessionId}`;
        createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    getAnalysisListReportFolderPath(sessionId) {
        //create folders if they don't exist
        var folderPath = `${this.getSessionReportFolderPath(sessionId)}/${CONSTANTS.ANALYSIS}`
        createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    getSessionSummaryReportFilePath(sessionId) {
        //create folders if they don't exist
        return `${this.getSessionReportFolderPath()}/${sessionId}_${CONSTANTS.SUMMARY}.json`;
    }

    getAnalysisReportFilePath(sessionId, cpuSlowDownMultiplier, networkSpeed) {
        //create folders if they don't exist
        return `${this.getAnalysisListReportFolderPath()}/${sessionId}_${CONSTANTS.CPU}_${cpuSlowDownMultiplier}_${CONSTANTS.NETWORK}_${networkSpeed.throughputKbps}.json`;
    }
}
