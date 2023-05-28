import { BaseReport } from "../base/BaseReport.js";
import { AnalysisResultModel } from "./AnalysisResultModel.js";
import * as fs from 'fs';

export class LighthouseAnalysisReport extends BaseReport {
    constructor(appInfo, reportFolder, logger, sessionId, cpuSlowDownMultiplier = null, networkSpeed = null) {
        super(appInfo, reportFolder, logger);
        this.appInfo = appInfo;
        this.sessionId = sessionId;
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.networkSpeed = networkSpeed;
        this.logger.logInfo(`Creating analysis report for session ${this.sessionId} with cpu slowdown multiplier ${cpuSlowDownMultiplier} and network speed ${networkSpeed}`);
        this.anaylsisReportPath = this.getAnalysisReportFilePath(this.sessionId, this.cpuSlowDownMultiplier, this.networkSpeed);
    }

    saveReport(jsonReport) {
        fs.writeFileSync(this.anaylsisReportPath, JSON.stringify(jsonReport), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.anaylsisReportPath}`);
    }

    getReport() {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.anaylsisReportPath, 'utf8');
        return JSON.parse(data);
    }

    getReportAsAnalysisResultModel() {
        //get analysis end time from jsonReport
        const jsonReport = this.getReport();
        //TODO - get date from report
        const analysisEndTime = new Date();
        const extractedNumericValues = this.extractNumericValue(jsonReport.audits);
        var networkSpeed = jsonReport.configSettings.customSettings.providedNetworkThrottling.throughputKbps;
        var cpuSlowDownMultiplier = jsonReport.configSettings.customSettings.providedCPUSlowDownMultiplier;
        const interactiveResultInMilliseconds = extractedNumericValues["interactive"];
        const speedIndexResultinMilliseconds = extractedNumericValues["speed-index"];
        this.logger.logInfo(`Interactive result is ${interactiveResultInMilliseconds} and speed index result is ${speedIndexResultinMilliseconds}`);
        return new AnalysisResultModel(this.appInfo, this.sessionId, this.appInfo.initiatedBy, this.appInfo.environment, jsonReport.fetchTime, analysisEndTime, networkSpeed, cpuSlowDownMultiplier, interactiveResultInMilliseconds, speedIndexResultinMilliseconds);
    }
    extractNumericValue(jsonObject) {
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
}
