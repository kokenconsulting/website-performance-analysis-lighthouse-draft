import { BaseReport } from "../../base/BaseReport.js";
import { CONSTANTS } from "../../base/Constants.js";
import { AuditReport } from "../../throttledAudit/AuditReport.js";
import { ThrottledAuditGroupSummaryReportModel } from "./ThrottledAuditGroupSummaryReportModel.js";
import * as fs from 'fs';
import * as path from 'path';

export class ThrottledAuditGroupSummaryReport extends BaseReport {
    constructor(webPage,webApplication, reportFolder, logger, auditGroupId) {
        super(webPage,webApplication, reportFolder, logger);
        this.webApplication = webApplication;
        this.auditGroupId = auditGroupId;
        this.reportFilePath = this.getReportFilePath(auditGroupId);
    }
    getReportFilePath(auditGroupId) {
        //create folders if they don't exist
        return `${this.getWebPageAuditReportFolderPath(auditGroupId)}/${auditGroupId}_${CONSTANTS.SUMMARY}.json`;
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
                var lighthouseAnalysisReport = new AuditReport(this.webPage,this.webApplication, this.reportFolder, this.logger, this.auditGroupId, cpuSlowDownMultiplier, networkSpeed);
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
        const sessionRunFolderPath = await this.getWebPageAuditReportFolderPath(this.auditGroupId);
        this.logger.logInfo(`Session run folder path is ${sessionRunFolderPath}`);
        const files = await fs.promises.readdir(sessionRunFolderPath);
        for (const file of files) {
            if (file.startsWith(this.auditGroupId)) {
                const filePath = path.join(sessionRunFolderPath, file);
                this.logger.logInfo(`File path is ${filePath}`);
                fileList.push(filePath);
            }
        }
        return fileList;
    }




}
