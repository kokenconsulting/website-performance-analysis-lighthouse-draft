import { WebPageBaseReport } from "../../base/BaseReport.js";
import { CONSTANTS } from "../../base/Constants.js";
import { ThrottledAuditReport } from "../../throttledAudit/ThrottledAuditReport.js";
import { ThrottledAuditGroupSummaryReportModel } from "./ThrottledAuditGroupSummaryReportModel.js";
import * as fs from 'fs';
import * as path from 'path';
import { WebPageModel } from "../../webPage/WebPageModel.js";
import { WebApplicationModel } from "../../webApplication/WebApplicationModel.js";

export class ThrottledAuditGroupSummaryReport extends WebPageBaseReport {
    private throttledAuditGroupId: string;
    private reportFilePath: string;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, reportFolder: string, logger: any, throttledAuditGroupId: string) {
        super(webPage, webApplication, reportFolder, logger);
        this.webApplication = webApplication;
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.reportFilePath = this.getReportFilePath(throttledAuditGroupId);
    }

    private getReportFilePath(throttledAuditGroupId: string): string {
        //create folders if they don't exist
        return `${this.getWebPageAuditReportFolderPath(throttledAuditGroupId)}/${throttledAuditGroupId}_${CONSTANTS.SUMMARY}.json`;
    }

    public async generate(): Promise<string | null> {
        try {
            const auditResultList = await this.getAuditResultList();
            const auditSummary = new ThrottledAuditGroupSummaryReportModel(this.webPage, this.webApplication, auditResultList);
            //before saving the report, remove duplicate web application object from each object in auditResultList
            //TODO - remove duplicate web application object from each object in auditResultList
            for (const analysisResult of auditSummary.auditResultList) {
                delete analysisResult.webApplication;
                delete analysisResult.webPage;
            }
            return this.saveReport(auditSummary);
        } catch (err) {
            this.logger.logError('Error:', err);
        }
        return null;
    }

    private saveReport(throttledAuditGroupSummaryReportObject: ThrottledAuditGroupSummaryReportModel): string {
        fs.writeFileSync(this.reportFilePath, JSON.stringify(throttledAuditGroupSummaryReportObject), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFilePath}`);
        return this.reportFilePath;
    }

    public getReport(): any {
        //TODO - return as ThrottledAuditGroupSummaryReportModel
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }

    private async getAuditResultList(): Promise<any[]> {
        const files = await this.getAuditFilePathList();
        const auditResultList = [];
        for (const filePath of files) {
            const data = await fs.promises.readFile(filePath, 'utf8');
            try {
                const jsonReport = JSON.parse(data);
                //TODO - this is stupid... just let AuditReport to parse the jsonReport
                const cpuSlowDownMultiplier = jsonReport.cpuSlowDownMultiplier;
                const networkSpeed = jsonReport.networkThrottle;
                const lighthouseAnalysisReport = new ThrottledAuditReport(this.webPage, this.webApplication, this.reportFolder, this.logger, this.throttledAuditGroupId, cpuSlowDownMultiplier, networkSpeed);
                const analysisResultReport = lighthouseAnalysisReport.getReport();
                auditResultList.push(analysisResultReport);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        return auditResultList;
    }

    private async getAuditFilePathList(): Promise<string[]> {
        const fileList = [];
        const throttledAuditGroupFolderPath = await this.getWebPageAuditReportFolderPath(this.throttledAuditGroupId);
        this.logger.logInfo(`Session run folder path is ${throttledAuditGroupFolderPath}`);
        const files = await fs.promises.readdir(throttledAuditGroupFolderPath);
        for (const file of files) {
            if (file.startsWith(this.throttledAuditGroupId)) {
                const filePath = path.join(throttledAuditGroupFolderPath, file);
                this.logger.logInfo(`File path is ${filePath}`);
                fileList.push(filePath);
            }
        }
        return fileList;
    }
}