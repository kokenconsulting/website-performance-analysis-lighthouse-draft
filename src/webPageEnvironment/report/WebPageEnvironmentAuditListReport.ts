import { WebPageBaseReport } from "../../base/BaseReport.js";
import { CONSTANTS } from "../../base/Constants.js";
import { WebApplicationModel } from "../../webApplication/WebApplicationModel.js";
import { WebPageModel } from "../../webPage/WebPageModel.js";
import { WebPageEnvironmentAuditListReportModel } from "./WebPageEnvironmentAuditListReportModel.js";
import * as fs from 'fs';

export class WebPageEnvironmentAuditListReport extends WebPageBaseReport {
    private reportFilePath: string;

    constructor(
        webPage: WebPageModel,
        webApplication: WebApplicationModel,
        reportFolder: string,
        logger: any
    ) {
        super(webPage, webApplication, reportFolder, logger);
        this.reportFilePath = this.getReportFilePath();
    }

    private getReportFilePath(): string {
        //create folders if they don't exist
        return `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.WEB_PAGE_ENVIRONMENT_AUDIT_LIST_FILE_NAME}`;
    }

    public async generate(): Promise<string | null> {
        try {
            const auditFilePathList = await this.getAuditFilePathList();
            const auditSummary = new WebPageEnvironmentAuditListReportModel(this.webPage, this.webApplication, auditFilePathList);
            return this.saveReport(auditSummary);
        } catch (err) {
            this.logger.logError('Error:', err);
        }
        return null;
    }

    private saveReport(reportModel: WebPageEnvironmentAuditListReportModel): string {
        fs.writeFileSync(this.reportFilePath, JSON.stringify(reportModel), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFilePath}`);
        return this.reportFilePath;
    }

    public getReport(): any {
        //TODO - return as ThrottledAuditGroupSummaryReportModel
        const data = fs.readFileSync(this.reportFilePath, 'utf8');
        return JSON.parse(data);
    }

    private isUUID(filename: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(filename);
    }

    private async getAuditFilePathList(): Promise<string[]> {
        const fileList: string[] = [];
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