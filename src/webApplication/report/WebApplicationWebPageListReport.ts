import { WebPageBaseReport } from "../../Base_2/BaseReport.js";
import { CONSTANTS } from "../../Base_2/Constants.js";
import { ProcessLogger } from "../../Log/ProcessLogger.js";
import { WebPageModel } from "../../webPage/WebPageModel.js";
import { WebApplicationModel } from "../WebApplicationModel.js";
import { WebApplicationWebPageListReporttModel } from "./WebApplicationWebPageListReportModel.js";
import * as fs from 'fs';

export class WebApplicationWebPageListReport extends WebPageBaseReport {
    private reportFilePath: string;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, reportFolder: string, logger: ProcessLogger) {
        super(webPage, webApplication, reportFolder, logger);
        this.webApplication = webApplication;
        this.reportFilePath = this.getReportFilePath();
    }

    private getReportFilePath(): string {
        //create folders if they don't exist
        return `${this.getWebApplicationReportFolderPath()}/${CONSTANTS.WEB_PAGE_LIST_FILE_NAME}`;
    }

    public async generate(): Promise<string | null> {
        try {
            const webPageList = await this.getFolderPathList();
            const reportModel = new WebApplicationWebPageListReporttModel(this.webPage, this.webApplication, webPageList);
            return this.saveReport(reportModel);
        } catch (err) {
            this.logger.logError('Error:', err);
        }
        return null;
    }

    private saveReport(reportModel: WebApplicationWebPageListReporttModel): string {
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