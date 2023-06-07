import { CONSTANTS } from "../base/Constants.js";
import { ProcessMonitorBaseReport } from "../base/ProcessMonitorBaseReport.js";
import { ProcessLogger } from "../log_2/ProcessLogger.js";
import { WebApplicationListReportModel } from "./WebApplicationListReportModel.js";
import * as fs from 'fs';

export class WebApplicationListReport extends ProcessMonitorBaseReport {
    private reportFilePath: string;

    constructor(reportFolder: string, logger: ProcessLogger) {
        
        super(reportFolder, logger);
        this.reportFilePath = this.getReportFilePath();
    }

    private getReportFilePath(): string {
        //create folders if they don't exist
        return `${this.getReportFolderPath()}/${CONSTANTS.WEB_APPLICATION_LIST_FILE_NAME}`;
    }

    public async generate(): Promise<string | null> {
        try {
            const webPageList = await this.getFolderPathList();
            const reportModel = new WebApplicationListReportModel(webPageList);
            return this.saveReport(reportModel);
        } catch (err) {
            this.logger.logError('Error:', err);
        }
        return null;
    }

    private saveReport(reportModel: WebApplicationListReportModel): string {
        fs.writeFileSync(this.reportFilePath, JSON.stringify(reportModel), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFilePath}`);
        return this.reportFilePath;
    }

    public getReport(): WebApplicationListReportModel {
        //TODO - return as ThrottledAuditGroupSummaryReportModel
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }

    private async getFolderPathList(): Promise<string[]> {
        const folderList: string[] = [];
        const folderPath = await this.getReportFolderPath();
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