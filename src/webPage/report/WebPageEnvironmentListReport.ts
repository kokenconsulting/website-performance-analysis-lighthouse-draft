import { WebPageBaseReport } from "../../base/BaseReport.js";
import { CONSTANTS } from "../../base/Constants.js";
import { ProcessLogger } from "../../log_2/ProcessLogger.js";
import { WebApplicationModel } from "../../webApplication/WebApplicationModel.js";
import { WebPageModel } from "../WebPageModel.js";
import { WebPageEnvironmentListReportModel } from "./WebPageEnvironmentListReportModel.js";
import * as fs from 'fs';

export class WebPageEnvironmentListReport extends WebPageBaseReport {
    private reportFilePath: string;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, reportFolder: string, logger: ProcessLogger) {
        super(webPage, webApplication, reportFolder, logger);
        this.reportFilePath = this.getReportFilePath();
    }

    private getReportFilePath(): string {
        //create folders if they don't exist
        return `${this.getWebPageWebPageFolderPath()}/${CONSTANTS.WEB_PAGE_ENVIRONMENT_LIST_FILE_NAME}`;
    }

    public async generate(): Promise<string | null> {
        try {
            const environmentFolderList = await this.getFolderPathList();
            const reportModel = new WebPageEnvironmentListReportModel(this.webPage, this.webApplication, environmentFolderList);
            return this.saveReport(reportModel);
        } catch (err) {
            this.logger.logError('Error:', err);
        }
        return null;
    }

    private saveReport(reportModel: WebPageEnvironmentListReportModel): string {
        fs.writeFileSync(this.reportFilePath, JSON.stringify(reportModel), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFilePath}`);
        return this.reportFilePath;
    }

    public getReport(): any {
        //TODO - return as ThrottledAuditGroupSummaryReportModel
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }

    private async getFolderPathList(): Promise<string[]> {
        const folderList: string[] = [];
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