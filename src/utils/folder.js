import * as path from 'path';
import * as fs from 'fs';
import { logInfo } from '../log/processlogger.js'


export function extractNumericValue(jsonObject) {
    const numericValuesObj = {};

    function traverse(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                traverse(obj[key]);
            } else if (key === 'numericValue') {
                numericValuesObj[obj["id"]] = obj[key]
            }
        }
    }

    traverse(jsonObject);

    return numericValuesObj;
}
export var getAnalysisReportFileName = function (sessionId, sessionFolder, networkSpeed, cpuSlowdownMultiplier) {
    const reportName = `${sessionId}_${cpuSlowdownMultiplier}_${networkSpeed.throughputKbps}.json`;
    const fullFilePath = path.join(sessionFolder, reportName);
    logInfo(`report file full path is ${fullFilePath}`);
    return fullFilePath;
};

export var prepareAppFolder = function (appInfo, reportFolder) {
    //check if a folder with appInfo.name exists. If not create it
    //dump appInfo to console
    const appFolder = path.join(reportFolder, appInfo.projectName);
    if (!fs.existsSync(appFolder)) {
        fs.mkdirSync(appFolder);
    }
    return appFolder;
}

export var prepareRunsFolder = function (appInfo, reportFolder) {
    const runsFolderName = "runs";

    const appFolder = prepareAppFolder(appInfo, reportFolder);
    const runsFolder = path.join(appFolder, runsFolderName);
    if (!fs.existsSync(runsFolder)) {
        fs.mkdirSync(runsFolder);
    }
    return runsFolder;
};

/**
 * Prepares the folder for the specified app version under the runs folder.
 * @param {Object} appInfo - The object containing information about the app.
 * @param {string} appInfo.projectName - The name of the project.
 * @param {string} appInfo.version - The version of the app.
 * @param {string} reportFolder - The path to the report folder.
 * @returns {string} - The path to the app version folder.
 */
export var prepareAppVersionFolder = function (appInfo, reportFolder) {
    //check if a folder with appInfo.name exists. If not create it
    //dump appInfo to console
    const appFolder = prepareRunsFolder(appInfo, reportFolder)
    //versionFolderName string consists of v prefix and appinfo.version
    const versionFolderName = `v${appInfo.version}`;
    //lets not save the session under a version anymore
    //const appVersionFolder = path.join(appFolder, versionFolderName);
    const appVersionFolder = appFolder;
    if (!fs.existsSync(appVersionFolder)) {
        fs.mkdirSync(appVersionFolder);
    }
    return appVersionFolder;
}

/**
 * The name of the folder where the session summary will be stored.
 * @type {string}
 */
export var prepareSessionSummaryFolderUnderApp = function (appInfo, reportFolder) {
    const summaryFolderName = "summary";
    //check if a folder with appInfo.name exists. If not create it
    //dump appInfo to console
    const appFolder = prepareAppFolder(appInfo, reportFolder);
    const appSummaryFolder = path.join(appFolder, summaryFolderName);
    if (!fs.existsSync(appSummaryFolder)) {
        fs.mkdirSync(appSummaryFolder);
    }
    return appSummaryFolder;
}
export var prepareChartDataFolderUnderApp = function (appInfo, reportFolder) {
    const chartDataFolderName = "chartdata";
    //check if a folder with appInfo.name exists. If not create it
    //dump appInfo to console12
    const appFolder = prepareAppFolder(appInfo, reportFolder);
    const chartData = path.join(appFolder, chartDataFolderName);
    if (!fs.existsSync(chartData)) {
        fs.mkdirSync(chartData);
    }
    return chartData;
}


export var prepareSessionReportFolder = function (appInfo, sessionId, reportFolder) {
    const appVersionFolder = prepareAppVersionFolder(appInfo, reportFolder);
    const sessionReportFolder = path.join(appVersionFolder, sessionId);
    if (!fs.existsSync(sessionReportFolder)) {
        fs.mkdirSync(sessionReportFolder, { recursive: true });
    }
    return sessionReportFolder;
};
export function getSessionSummaryOutputPath(appInfo, sessionId, reportFolder) {
    const sessionFolderPath = prepareSessionReportFolder(appInfo, sessionId, reportFolder);
    return path.join(sessionFolderPath, `${sessionId}-summary.json`);
}
export function getApplicationSessionListOutputPath(appInfo,reportFolder) {
    const appFolder = prepareAppFolder(appInfo,reportFolder);
    return path.join(appFolder, `${appInfo.projectName}-sessionlist.json`);
}

