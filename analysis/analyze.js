import * as fs from 'fs';
import * as path from 'path';
import { engine } from './core.js';
import { logInfo } from '../log/processlogger.js'
import { AnalysisResult } from '../models/analysisResult.js';
import { extractNumericValue, getAnalysisReportFileName, prepareSessionReportFolder, getSessionSummaryOutputPath } from '../utils/folder.js';


export async function orchestrateAnalysisWithBuiltInThrottling(sessionId, appInfo, url, networkSpeed, cpuSlowdownMultiplier, reportFolder) {

    const sessionFolderPath = prepareSessionReportFolder(appInfo, sessionId, reportFolder);
    const jsonReport = await engine(url, networkSpeed, cpuSlowdownMultiplier);

    let tempReportPath = getAnalysisReportFileName(sessionId, sessionFolderPath, networkSpeed, cpuSlowdownMultiplier);

    fs.writeFileSync(tempReportPath, JSON.stringify(jsonReport), 'utf8');
}
export async function orchestrateWithExternalNetworkThrottling(sessionId, appInfo, url, networkSpeed, cpuSlowdownMultiplier, reportFolder) {
    //network speed is set to 0, as we are using external throttling
    //clone network speed into another object as we are going to modify it  
    var configNetworkSpeed = {
        rttMs: networkSpeed.rttMs,
        throughputKbps: networkSpeed.throughputKbps
    }
    var resettedNetworkSpeed = {
        rttMs: 0,
        throughputKbps: 0
    }
    const sessionFolderPath = prepareSessionReportFolder(appInfo, sessionId, reportFolder);
    const jsonReport = await engine(url, resettedNetworkSpeed, cpuSlowdownMultiplier, configNetworkSpeed);

    let tempReportPath = getAnalysisReportFileName(sessionId, sessionFolderPath, configNetworkSpeed, cpuSlowdownMultiplier);

    fs.writeFileSync(tempReportPath, JSON.stringify(jsonReport), 'utf8');
}

export async function generateDataForSession(appInfo, reportFolder, sessionId) {
    try {
        const analysisResultList = [];
        const sessionRunFolderPath = prepareSessionReportFolder(appInfo, sessionId, reportFolder);
        const files = await getSessionFilePathList(sessionRunFolderPath, sessionId);

        for (const filePath of files) {
            logInfo(`generateDataForSession --- file path is ${filePath}`);
            const data = await fs.promises.readFile(filePath, 'utf8');
            try {
                const jsonReport = JSON.parse(data);
                addDataToAnalysisResultArray(sessionId, jsonReport, analysisResultList, appInfo);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        const sessionReportOutputPath = getSessionSummaryOutputPath(appInfo, sessionId, reportFolder);
        await fs.promises.writeFile(sessionReportOutputPath, JSON.stringify(analysisResultList), 'utf8');
    } catch (err) {
        console.error('Error:', err);
    }
}



async function getSessionFilePathList(sessionReportsFolder, filePrefix) {
    var fileList = [];

    const files = await fs.promises.readdir(sessionReportsFolder);
    for (const file of files) {
        if (file.startsWith(filePrefix)) {
            const filePath = path.join(sessionReportsFolder, file);
            logInfo(`File path is ${filePath}`);
            fileList.push(filePath);
        }

    }
    return fileList;
}

function addDataToAnalysisResultArray(sessionId, jsonReport, loadTimeData, appInfo) {
    const extractedNumericValues = extractNumericValue(jsonReport.audits);
    const analysisEndTime = new Date();
    logInfo(`Extracted numeric values are ${JSON.stringify(extractedNumericValues)}`);
    var networkSpeed = jsonReport.configSettings.externalNetworkSpeed.throughputKbps;
    var cpuSlowDownMultiplier = jsonReport.configSettings.throttling.cpuSlowdownMultiplier;
    logInfo(`Network speed is ${networkSpeed} and cpu slowdown multiplier is ${cpuSlowDownMultiplier}`);
    const interactiveResultInMilliseconds = extractedNumericValues["interactive"];
    const speedIndexResultinMilliseconds = extractedNumericValues["speed-index"];
    logInfo(`Interactive result is ${interactiveResultInMilliseconds} and speed index result is ${speedIndexResultinMilliseconds}`);
    const analysisResultReport = new AnalysisResult(appInfo, sessionId, appInfo.initiatedBy, "env-to-be-filled-in", jsonReport.fetchTime, analysisEndTime, networkSpeed, cpuSlowDownMultiplier, interactiveResultInMilliseconds, speedIndexResultinMilliseconds);
    logInfo(`Analysis result is ${JSON.stringify(analysisResultReport)}`);
    loadTimeData.push(analysisResultReport);
}

