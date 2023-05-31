import { BaseReport } from "../../base/BaseReport.js";
import { CONSTANTS } from "../../base/Constants.js";
import { WebApplicationWebPageListReporttModel } from "./WebApplicationWebPageListReportModel.js";
import * as fs from 'fs';

export class WebApplicationWebPageListReport extends BaseReport {
    constructor(webPage, webApplication, reportFolder, logger) {
        super(null, webApplication, reportFolder, logger);
        this.webApplication = webApplication;
        this.reportFilePath = this.getReportFilePath();
    }
    getReportFilePath() {
        //create folders if they don't exist
        return `${this.getWebApplicationReportFolderPath()}/${CONSTANTS.WEB_PAGE_LIST_FILE_NAME}`;
    }
    async generate() {
        try {
            const webPageList = await this.getFolderPathList();
            var reportModel = new WebApplicationWebPageListReporttModel(this.webPage, this.webApplication, webPageList);
            return this.saveReport(reportModel);
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
        //TODO - return as WebPageThrottledAuditSummaryReportModel
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }

    async getFolderPathList() {
        var folderList = [];
        const folderPath = await this.getWebApplicationReportFolderPath();
        this.logger.logInfo(`Session run folder path is ${folderPath}`);
        const folders = await fs.promises.readdir(folderPath, { withFileTypes: true });
        for (const folder of folders) {
            if (folder.isDirectory()) {
                this.logger.logInfo(`Folder name is ${folder.name}`);
                folderList.push(folder.name);
            }
        }
        return folderList;
    }
}
