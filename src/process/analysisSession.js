import * as path from 'path';
import { logInfo } from '../log/processlogger.js'
import { AnalysisResult } from '../models/analysisResult.js';
import { extractNumericValue,  prepareSessionReportFolder, getSessionSummaryOutputPath } from '../utils/folder.js';

export async function compileDataForSession(appInfo, reportFolder, sessionId) {
    try {
        const analysisResultList = [];
        const sessionRunFolderPath = prepareSessionReportFolder(appInfo, sessionId, reportFolder);
        const files = await getSessionFilePathList(sessionRunFolderPath, sessionId);

        for (const filePath of files) {
            logInfo(`compileDataForSession --- file path is ${filePath}`);
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

