import * as fs from 'fs';
import { engine } from './core.js';
import { getAnalysisReportFileName, prepareSessionReportFolder } from '../utils/folder.js';

export async function orchestrateAnalysisWithThrottling(sessionId, appInfo, url, isExternalThrottlingUsed, networkSpeed, cpuSlowdownMultiplier, reportFolder) {
    const sessionFolderPath = prepareSessionReportFolder(appInfo, sessionId, reportFolder);
    let jsonReport = null;
    if (isExternalThrottlingUsed === true) {
        var resettedNetworkSpeed = {
            rttMs: 0,
            throughputKbps: 0
        }
        jsonReport = await engine(url, resettedNetworkSpeed, cpuSlowdownMultiplier, networkSpeed);
    } else {
        jsonReport = await engine(url, networkSpeed, cpuSlowdownMultiplier);
    }
    const tempReportPath = getAnalysisReportFileName(sessionId, sessionFolderPath, networkSpeed, cpuSlowdownMultiplier);
    fs.writeFileSync(tempReportPath, JSON.stringify(jsonReport), 'utf8');
}



