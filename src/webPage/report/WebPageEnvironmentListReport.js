import { BaseReport } from "../../base/BaseReport.js";
import { CONSTANTS } from "../../base/Constants.js";
import { WebPageEnvironmentListReportModel } from "./WebPageEnvironmentListReportModel.js";
import * as fs from 'fs';

export class WebPageEnvironmentListReport extends BaseReport {
    constructor(webPage, webApplication, reportFolder, logger) {
        super(webPage, webApplication, reportFolder, logger);
        this.webApplication = webApplication;
        this.reportFilePath = this.getReportFilePath();
    }
    getReportFilePath() {
        //create folders if they don't exist
        return `${this.getWebPageWebPageFolderPath()}/${CONSTANTS.WEB_PAGE_ENVIRONMENT_LIST_FILE_NAME}`;
    }
    async generate() {
        try {
            const environmentFolderList = await this.getFolderPathList();
            var reportModel = new WebPageEnvironmentListReportModel(this.webPage, this.webApplication, environmentFolderList);
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
        //TODO - return as ThrottledAuditGroupSummaryReportModel
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }

    async getFolderPathList() {
        var folderList = [];
        const folderPath = await this.getWebPageWebPageFolderPath();
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
