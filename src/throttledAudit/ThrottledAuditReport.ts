import { WebPageBaseReport } from "../Base/BaseReport.js";
import { ThrottledAuditResultModel } from "./ThrottledAuditResultModel.js";
import { LighthouseAuditReport } from '../lighthouse/LighthouseAuditReport.js';
import * as fs from 'fs';
import * as path from 'path';
import { WebPageModel } from "../webPage/WebPageModel.js";
import { WebApplicationModel } from "../webApplication/WebApplicationModel.js";
import { ProcessLogger } from "../Log/ProcessLogger.js";

export class ThrottledAuditReport extends WebPageBaseReport {
    private throttledAuditGroupId: string;
    private cpuSlowDownMultiplier: number;
    private networkSpeed: any;
    private lighthouseReport: LighthouseAuditReport;
    private reportFilePath: string;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, reportFolder: string, logger: ProcessLogger, throttledAuditGroupId: string, cpuSlowDownMultiplier: number, networkSpeed: any) {
        super(webPage, webApplication, reportFolder, logger);
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.networkSpeed = networkSpeed;
        this.logger.logInfo(`Creating analysis report for throttledAuditGroup ${this.throttledAuditGroupId} with cpu slowdown multiplier ${cpuSlowDownMultiplier} and network speed ${networkSpeed}`);
        this.lighthouseReport = new LighthouseAuditReport(this.webPage, this.webApplication, this.reportFolder, this.logger, this.throttledAuditGroupId, this.cpuSlowDownMultiplier, this.networkSpeed);
        this.reportFilePath = this.getReportFilePath();
    }

    private getReportFilePath(): string {
        const fileName = `${this.throttledAuditGroupId}_cpu_${this.cpuSlowDownMultiplier}_network_${this.networkSpeed.throughputKbps}.json`;
        return path.join(this.getWebPageAuditReportFolderPath(this.throttledAuditGroupId), fileName);
    }

    public generate(): void {
        const lighthouseAnalysisResult = this.lighthouseReport.getReport();
        const auditModel = this.getReportAsThrottledAuditResultModel(lighthouseAnalysisResult);
        this.saveReport(auditModel);
    }

    private saveReport(auditModel: any): void {
        fs.writeFileSync(this.reportFilePath, auditModel.toJson(), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFilePath}`);
    }

    public getReport(): any {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }

    private getReportAsThrottledAuditResultModel(lighthouseAnalysisResult: any): ThrottledAuditResultModel {
        //TODO - get date from report
        const analysisEndTime = new Date();
        const extractedNumericValues = this.extractNumericValue(lighthouseAnalysisResult.audits);
        const networkSpeed = lighthouseAnalysisResult.configSettings.customSettings.providedNetworkThrottling;
        const cpuSlowDownMultiplier = lighthouseAnalysisResult.configSettings.customSettings.providedCPUSlowDownMultiplier;
        const interactiveResultInMilliseconds = extractedNumericValues["interactive"];
        const speedIndexResultinMilliseconds = extractedNumericValues["speed-index"];
        this.logger.logInfo(`Interactive result is ${interactiveResultInMilliseconds} and speed index result is ${speedIndexResultinMilliseconds}`);
        return new ThrottledAuditResultModel(this.webPage, this.webApplication, this.throttledAuditGroupId, this.webApplication.initiatedBy, this.webApplication.environment, lighthouseAnalysisResult.fetchTime, analysisEndTime, networkSpeed, cpuSlowDownMultiplier, interactiveResultInMilliseconds, speedIndexResultinMilliseconds);
    }

    private extractNumericValue(jsonObject: Record<string, any>): Record<string, number> {
        //TODO - handle nested objects
        const numericValues: Record<string, number> = {};
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                const audit = jsonObject[key];
                if (audit.numericValue !== undefined) {
                    numericValues[key] = audit.numericValue;
                }
            }
        }
        return numericValues;
    }
}