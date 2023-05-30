import { BaseReport } from "../base/BaseReport.js";
import { LighthouseAuditReport } from "../audit/LighthouseAuditReport.js";
import { WebPageThrottledAuditSummaryModel } from "./WebPageThrottledAuditSummaryModel.js";
import * as fs from 'fs';
import * as path from 'path';
export class WebPageThrottledAuditSummaryReport extends BaseReport {
    constructor(webApplication, reportFolder, logger,auditInstanceId) {
        super(webApplication, reportFolder,logger);
        this.webApplication = webApplication;
        this.auditInstanceId = auditInstanceId;
        this.WebPageThrottledAuditSummaryReportFilePath = this.getWebPageThrottledAuditSummaryReportFilePath(auditInstanceId);
    }
    async generate() {
        try {
            const auditResultList = await this.getAnalysisResultList();
            var auditSummary = new WebPageThrottledAuditSummaryModel(this.webApplication, auditResultList);
            //before saving the report, remove duplicate web application object from each object in auditResultList
            //TODO - remove duplicate web application object from each object in auditResultList
            for (const analysisResult of auditSummary.auditResultList) {
                delete analysisResult.webApplication;
            }
            return this.saveReport(auditSummary);
        } catch (err) {
            this.logger.logError('Error:', err);
        }
        return null;
    }

    async getSessionFilePathList() {
        var fileList = [];
        const sessionRunFolderPath = await this.getAnalysisListReportFolderPath(this.auditInstanceId);
        this.logger.logInfo(`Session run folder path is ${sessionRunFolderPath}`);
        const files = await fs.promises.readdir(sessionRunFolderPath);
        for (const file of files) {
            if (file.startsWith(this.auditInstanceId)) {
                const filePath = path.join(sessionRunFolderPath, file);
                this.logger.logInfo(`File path is ${filePath}`);
                fileList.push(filePath);
            }

        }
        return fileList;
    }

    async getAnalysisResultList() {
        const files = await this.getSessionFilePathList()
        const auditResultList = [];
        for (const filePath of files) {
            const data = await fs.promises.readFile(filePath, 'utf8');
            try {
                const jsonReport = JSON.parse(data);
                //TODO - get from proper path
                var cpuSlowDownMultiplier = jsonReport.configSettings.customSettings.providedCPUSlowDownMultiplier;
                var networkSpeed = jsonReport.configSettings.customSettings.providedNetworkThrottling;
                var lighthouseAnalysisReport = new LighthouseAuditReport(this.webApplication, this.reportFolder, this.logger, this.auditInstanceId, cpuSlowDownMultiplier, networkSpeed);
                var analysisResultReport = lighthouseAnalysisReport.getReportAsAuditResultModel();
                auditResultList.push(analysisResultReport);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        return auditResultList;
    }


    saveReport(WebPageThrottledAuditSummaryReportObject) {

        fs.writeFileSync(this.WebPageThrottledAuditSummaryReportFilePath, JSON.stringify(WebPageThrottledAuditSummaryReportObject), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.WebPageThrottledAuditSummaryReportFilePath}`);
        return this.WebPageThrottledAuditSummaryReportFilePath;
    }

    getReport() {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.WebPageThrottledAuditSummaryReportFilePath, 'utf8');
        return JSON.parse(data);
    }

}
