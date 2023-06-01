import { BaseReport } from "../../base/BaseReport.js";
import { CONSTANTS } from "../../base/Constants.js";
import { WebPageEnvironmentAuditListReportModel } from "./WebPageEnvironmentAuditListReportModel.js";
import * as fs from 'fs';
import * as path from 'path';

export class WebPageEnvironmentAuditListReport extends BaseReport {
    constructor(webPage, webApplication, reportFolder, logger) {
        super(webPage, webApplication, reportFolder, logger);
        this.webApplication = webApplication;
        this.reportFilePath = this.getReportFilePath();
    }
    getReportFilePath(throttledAuditGroupId) {
        //create folders if they don't exist
        return `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.WEB_PAGE_ENVIRONMENT_AUDIT_LIST_FILE_NAME}`;
    }
    async generate() {
        try {
            const auditFilePathList = await this.getAuditFilePathList();
            var auditSummary = new WebPageEnvironmentAuditListReportModel(this.webPage, this.webApplication, auditFilePathList);
            return this.saveReport(auditSummary);
        } catch (err) {
            this.logger.logError('Error:', err);
        }
        return null;
    }

    saveReport(reportModel) {
        fs.writeFileSync(this.reportFilePath, JSON.stringify(reportModel), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFilePath}`);
        return this.reportFilePath;
    }

    getReport() {
        //TODO - return as ThrottledAuditGroupSummaryReportModel
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }
    isUUID(filename) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(filename);
    }
    async getAuditFilePathList() {
        var fileList = [];
        const folderPath = await this.getWebPageAuditFolderPath();
        this.logger.logInfo(`Session run folder path is ${folderPath}`);
        const files = await fs.promises.readdir(folderPath);
        for (const file of files) {
            //generate code to check if file is a uuid
            if (this.isUUID(file) === true) {
                this.logger.logInfo(`File path is ${file}`);
                fileList.push(file);
            }
        }
        return fileList;
    }

}
