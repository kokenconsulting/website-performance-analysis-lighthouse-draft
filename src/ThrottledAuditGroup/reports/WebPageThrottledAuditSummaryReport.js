import { BaseReport } from "../../base/BaseReport.js";
import { CONSTANTS } from "../../base/Constants.js";
import { AuditReport } from "../../audit/AuditReport.js";
import { ThrottledAuditGroupSummaryReportModel } from "./ThrottledAuditGroupSummaryReportModel.js";
import * as fs from 'fs';
import * as path from 'path';

export class ThrottledAuditGroupSummaryReport extends BaseReport {
    constructor(webPage,webApplication, reportFolder, logger, throttledAuditGroupId) {
        super(webPage,webApplication, reportFolder, logger);
        this.webApplication = webApplication;
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.reportFilePath = this.getReportFilePath(throttledAuditGroupId);
    }
    getReportFilePath(throttledAuditGroupId) {
        //create folders if they don't exist
        return `${this.getWebPageAuditReportFolderPath(throttledAuditGroupId)}/${throttledAuditGroupId}_${CONSTANTS.SUMMARY}.json`;
    }
    async generate() {
        try {
            const auditResultList = await this.getAuditResultList();
            var auditSummary = new ThrottledAuditGroupSummaryReportModel(this.webPage,this.webApplication, auditResultList);
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

    saveReport(ThrottledAuditGroupSummaryReportObject) {

        fs.writeFileSync(this.reportFilePath, JSON.stringify(ThrottledAuditGroupSummaryReportObject), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFilePath}`);
        return this.reportFilePath;
    }

    getReport() {
        //TODO - return as ThrottledAuditGroupSummaryReportModel
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }


    async getAuditResultList() {
        const files = await this.getAuditFilePathList()
        const auditResultList = [];
        for (const filePath of files) {
            const data = await fs.promises.readFile(filePath, 'utf8');
            try {
                const jsonReport = JSON.parse(data);
                //TODO - this is stupid... just let AuditReport to parse the jsonReport
                var cpuSlowDownMultiplier = jsonReport.cpuSlowDownMultiplier;
                var networkSpeed = jsonReport.networkThrottle;
                var lighthouseAnalysisReport = new AuditReport(this.webPage,this.webApplication, this.reportFolder, this.logger, this.throttledAuditGroupId, cpuSlowDownMultiplier, networkSpeed);
                var analysisResultReport = lighthouseAnalysisReport.getReport();
                auditResultList.push(analysisResultReport);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        return auditResultList;
    }

    async getAuditFilePathList() {
        var fileList = [];
        const throttledAuditGroupRunFolderPath = await this.getWebPageAuditReportFolderPath(this.throttledAuditGroupId);
        this.logger.logInfo(`Session run folder path is ${throttledAuditGroupRunFolderPath}`);
        const files = await fs.promises.readdir(throttledAuditGroupRunFolderPath);
        for (const file of files) {
            if (file.startsWith(this.throttledAuditGroupId)) {
                const filePath = path.join(throttledAuditGroupRunFolderPath, file);
                this.logger.logInfo(`File path is ${filePath}`);
                fileList.push(filePath);
            }
        }
        return fileList;
    }




}
