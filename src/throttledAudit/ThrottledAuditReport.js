import { BaseReport } from "../base/BaseReport.js";
import { ThrottledAuditResultModel } from "./ThrottledAuditResultModel.js";
import { LighthouseAuditReport } from '../lighthouse/LighthouseAuditReport.js';
import * as fs from 'fs';
import * as path from 'path';

export class ThrottledAuditReport extends BaseReport {
    constructor(webPage,webApplication, reportFolder, logger, throttledAuditGroupId, cpuSlowDownMultiplier, networkSpeed) {
        super(webPage,webApplication, reportFolder, logger);
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.networkSpeed = networkSpeed;
        this.logger.logInfo(`Creating analysis report for session ${this.throttledAuditGroupId} with cpu slowdown multiplier ${cpuSlowDownMultiplier} and network speed ${networkSpeed}`);
        this.lighthouseReport = new LighthouseAuditReport(this.webPage,this.webApplication, this.reportFolder, this.logger, this.throttledAuditGroupId, this.cpuSlowDownMultiplier, this.networkSpeed);
        this.reportFilePath = this.getReportFilePath();
    }

    getReportFilePath() {
        const fileName = `${this.throttledAuditGroupId}_cpu_${this.cpuSlowDownMultiplier}_network_${this.networkSpeed.throughputKbps}.json`;
        return path.join(this.getWebPageAuditReportFolderPath(this.throttledAuditGroupId),fileName);
    }

    generate() {
        var lighthouseAnalysisResult = this.lighthouseReport.getReport();
        var auditModel = this.getReportAsThrottledAuditResultModel(lighthouseAnalysisResult);
        this.saveReport(auditModel)
    }

    saveReport(auditModel) {
        
        fs.writeFileSync(this.reportFilePath, auditModel.toJson(), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFilePath}`);
    }

    getReport() {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }

    getReportAsThrottledAuditResultModel(lighthouseAnalysisResult) {
        //TODO - get date from report
        const analysisEndTime = new Date();
        const extractedNumericValues = this.extractNumericValue(lighthouseAnalysisResult.audits);
        var networkSpeed = lighthouseAnalysisResult.configSettings.customSettings.providedNetworkThrottling;
        var cpuSlowDownMultiplier = lighthouseAnalysisResult.configSettings.customSettings.providedCPUSlowDownMultiplier;
        const interactiveResultInMilliseconds = extractedNumericValues["interactive"];
        const speedIndexResultinMilliseconds = extractedNumericValues["speed-index"];
        this.logger.logInfo(`Interactive result is ${interactiveResultInMilliseconds} and speed index result is ${speedIndexResultinMilliseconds}`);
        return new ThrottledAuditResultModel(this.webPage,this.webApplication, this.throttledAuditGroupId, this.webApplication.initiatedBy, this.webApplication.environment, lighthouseAnalysisResult.fetchTime, analysisEndTime, networkSpeed, cpuSlowDownMultiplier, interactiveResultInMilliseconds, speedIndexResultinMilliseconds);
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
