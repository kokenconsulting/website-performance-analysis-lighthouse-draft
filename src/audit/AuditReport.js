import { BaseReport } from "../base/BaseReport.js";
import { AuditResultModel } from "./AuditResultModel.js";
import {LighthouseAuditReport} from './LighthouseAuditReport.js';
import * as fs from 'fs';

export class AuditReport extends BaseReport {
    constructor(webApplication, reportFolder, logger, auditInstanceId, cpuSlowDownMultiplier, networkSpeed) {
        super(webApplication, reportFolder, logger);
        this.webApplication = webApplication;
        this.auditInstanceId = auditInstanceId;
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.networkSpeed = networkSpeed;
        this.logger.logInfo(`Creating analysis report for session ${this.auditInstanceId} with cpu slowdown multiplier ${cpuSlowDownMultiplier} and network speed ${networkSpeed}`);
        this.lighthouseReport = new LighthouseAuditReport(this.webApplication, this.reportFolder, this.logger, this.auditInstanceId, this.cpuSlowDownMultiplier, this.networkSpeed);
        // this.anaylsisReportPath = this.getAnalysisReportFilePath(this.auditInstanceId, this.cpuSlowDownMultiplier, this.networkSpeed);
    }

    generate(){
        var lighthouseAnalysisResult = this.lighthouseReport.getReport();
        var auditModel = this.getReportAsAuditResultModel(lighthouseAnalysisResult);
        this.saveReport(auditModel)
    }

    saveReport(auditModel) {
        fs.writeFileSync(this.anaylsisReportPath, JSON.stringify(auditModel), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.anaylsisReportPath}`);
    }

    getReport() {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.anaylsisReportPath, 'utf8');
        return JSON.parse(data);
    }

    getReportAsAuditResultModel(lighthouseAnalysisResult) {
        //TODO - get date from report
        const analysisEndTime = new Date();
        const extractedNumericValues = this.extractNumericValue(jsonReport.audits);
        var networkSpeed = jsonReport.configSettings.customSettings.providedNetworkThrottling.throughputKbps;
        var cpuSlowDownMultiplier = jsonReport.configSettings.customSettings.providedCPUSlowDownMultiplier;
        const interactiveResultInMilliseconds = extractedNumericValues["interactive"];
        const speedIndexResultinMilliseconds = extractedNumericValues["speed-index"];
        this.logger.logInfo(`Interactive result is ${interactiveResultInMilliseconds} and speed index result is ${speedIndexResultinMilliseconds}`);
        return new AuditResultModel(this.webApplication, this.auditInstanceId, this.webApplication.initiatedBy, this.webApplication.environment, jsonReport.fetchTime, analysisEndTime, networkSpeed, cpuSlowDownMultiplier, interactiveResultInMilliseconds, speedIndexResultinMilliseconds);
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
