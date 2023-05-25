//this file generates data for charting purposes. 
// Path: scripts/lighthouse-library/chartdata/specificApplication.js

import * as fs from 'fs';
import { logInfo } from '../log/processlogger.js'
import { CPUSlowDownMultiplierImpact } from '../models/cpuSlowDownMultiplierImpact.js';
//require utils.js
import { getAnalysisReportFileName, prepareChartDataFolderUnderApp, getSessionSummaryOutputPath } from '../utils/folder.js';

import * as path from 'path';

//read session data from the folder that is retrieved via prepareChartDataFolderUnderApp function and catagorise data so that it can be plotted into a chart
/**
 * @typedef {Object} AnalysisResult
 * @property {string} url - The URL of the analyzed page.
 * @property {number} performanceScore - The performance score of the analyzed page.
 * @property {number} accessibilityScore - The accessibility score of the analyzed page.
 * @property {number} bestPracticesScore - The best practices score of the analyzed page.
 * @property {number} seoScore - The SEO score of the analyzed page.
 * @property {number} pwaScore - The PWA score of the analyzed page.
 * @property {string} reportFilePath - The file path of the generated report for the analyzed page.
 */

/**
 * An array of analysis results for a session.
 * @type {AnalysisResult[]}
 */
export function prepareThrottlingChartDataForSession(appInfo, sessionId, reportFolder) {
    const chartDataFolder = prepareChartDataFolderUnderApp(appInfo, reportFolder);
    const sessionSummaryPath = getSessionSummaryOutputPath(appInfo, sessionId, reportFolder);
    const data = fs.readFileSync(sessionSummaryPath, 'utf8');
    //this is a list of analysis results defined under models/analysisResult.js
    const analysisResultList = JSON.parse(data);
    var cpuSlowDownMultiplierImpactList = processThrottlingData(appInfo, analysisResultList);
    const chartDataFilePath = path.join(chartDataFolder, `${sessionId}_cpuSlowDownMultiplierImpact.json`);
    fs.writeFileSync(chartDataFilePath, JSON.stringify(cpuSlowDownMultiplierImpactList));
}

//function named cpuSlowDownMultiplierImpact analysis will get list of analysis results and return a list of cpuSlowDownMultiplierImpact objects.
//cpuSlowDownMultiplierImpact object is defined under models/cpuSlowDownMultiplierImpact.js
//this function will loop over the list of analysis result objects and will extract network speeds. For each network speed, it will extract the cpuSlowDownMultiplierImpact object and add it to the list of cpuSlowDownMultiplierImpact objects.
//cpuSlowDownMultiplierImpact object will have the following properties:
//networkSpeed
//cpuSlowDownMultiplier
//interactive result
//speed index
function processThrottlingData(appInfo, analysisResultList) {
    //this will be y axis
    const cpuSlowDownMultiplierImpactList = { interactiveResult: {}, speedIndex: {} };
    //this will be x axis
    const networkSpeedList = [];
    //sort analysisResultList by network speed
    analysisResultList.sort((a, b) => (a.networkThrottle > b.networkThrottle) ? 1 : -1);
    //log analysisResult

    for (const analysisResult of analysisResultList) {
        logInfo(`analysisResultList is ${JSON.stringify(analysisResult)}`);
        const cpuSlowDownMultiplierStringValue = analysisResult.cpuSlowDownMultiplier + "";
        //check if cpuSlowDownMultiplierImpactList has a property with the key that equals analysisResult.cpuSlowDownMultiplier value
        if (!cpuSlowDownMultiplierImpactList.interactiveResult.hasOwnProperty(cpuSlowDownMultiplierStringValue)) {
            cpuSlowDownMultiplierImpactList.interactiveResult[cpuSlowDownMultiplierStringValue] = [];
        }

        if (!cpuSlowDownMultiplierImpactList.speedIndex.hasOwnProperty(cpuSlowDownMultiplierStringValue)) {
            cpuSlowDownMultiplierImpactList.speedIndex[cpuSlowDownMultiplierStringValue] = [];
        }
        cpuSlowDownMultiplierImpactList.interactiveResult[cpuSlowDownMultiplierStringValue].push(analysisResult.loadTimeInteractive);
        cpuSlowDownMultiplierImpactList.speedIndex[cpuSlowDownMultiplierStringValue].push(analysisResult.loadTimeSpeedIndex);
        // check if value exists in the array. if not add one
        if (!networkSpeedList.includes(analysisResult.networkThrottle)) {
            networkSpeedList.push(analysisResult.networkThrottle);
        }

    }
    return new CPUSlowDownMultiplierImpact(appInfo, networkSpeedList, cpuSlowDownMultiplierImpactList);
}
