import { WebPageBaseReport } from "../base/BaseReport.js";
import { CONSTANTS } from "../base/Constants.js";
import * as fs from 'fs';
import * as path from 'path';
import { WebPageModel } from "../webPage/WebPageModel.js";
import { WebApplicationModel } from "../webApplication/WebApplicationModel.js";
import { ProcessLogger } from "../Log/ProcessLogger.js";

export class LighthouseAuditReport extends WebPageBaseReport {
    private throttledAuditGroupId: string;
    private cpuSlowDownMultiplier: number;
    private networkSpeed: any;
    private reportFileName: string;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, reportFolder: string, logger: ProcessLogger, throttledAuditGroupId: string, cpuSlowDownMultiplier: number, networkSpeed: any) {
        super(webPage, webApplication, reportFolder, logger);
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.networkSpeed = networkSpeed;
        this.logger.logInfo(`Creating analysis report for throttled audit group ${this.throttledAuditGroupId} with cpu slowdown multiplier ${cpuSlowDownMultiplier} and network speed ${networkSpeed}`);
        this.reportFileName = this.getReportFilePath();
    }

    private getLighthouseAuditReportFolderPath(): string {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageAuditFolderPath()}/${this.throttledAuditGroupId}/${CONSTANTS.LIGHTHOUSE}`;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    private getReportFilePath(): string {
        const fileName = `${this.webApplication.name}_${this.throttledAuditGroupId}_${CONSTANTS.LIGHTHOUSE}_cpu_${this.cpuSlowDownMultiplier}_network_${this.networkSpeed.throughputKbps}.json`;
        return path.join(this.getLighthouseAuditReportFolderPath(), fileName);
    }

    public saveReport(jsonReport: any): void {
        fs.writeFileSync(this.reportFileName, JSON.stringify(jsonReport), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFileName}`);
    }

    public getReport(): any {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.reportFileName, 'utf8');
        return JSON.parse(data);
    }
}