import * as fs from 'fs';
import { CONSTANTS } from './Constants.js';

export class BaseReport {
    protected webPage: any;
    protected webApplication: any;
    protected reportFolder: string;
    protected logger: any;

    constructor(webPage: any, webApplication: any, reportFolder: string, logger: any) {
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;
        this.logger = logger;
    }

    public createFoldersIfNotExist(folderPath: string): void {
        if (!fs.existsSync(folderPath)) {
            fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) throw err;
                this.logger.logInfo(`${folderPath} -- Folder created!`);
            });
        }
    }

    public getReportFolderPath(): string {
        const folderPath = this.reportFolder;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    public getWebApplicationReportFolderPath(): string {
        const folderPath = `${this.getReportFolderPath()}/${this.webApplication.id}`;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    public getWebPageWebPageFolderPath(): string {
        //create folders if they don't exist
        const folderPath = `${this.getWebApplicationReportFolderPath()}/${this.webPage.id}`;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    public getWebPageEnvironmentFolderPath(): string {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageWebPageFolderPath()}/${this.webPage.environment}`;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    public getWebPageEnvironmentChartDataFolderPath(): string {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.CHARTDATA}`;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    public getWebPageAuditFolderPath(): string {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageEnvironmentFolderPath()}/${CONSTANTS.AUDIT}`;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    public getWebPageAuditReportFolderPath(throttledAuditGroupId: string): string {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageAuditFolderPath()}/${throttledAuditGroupId}`;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    public getWebPageAuditChartDataFolderPath(throttledAuditGroupId: string): string {
        const folderPath = `${this.getWebPageAuditReportFolderPath(throttledAuditGroupId)}/${CONSTANTS.CHARTDATA}`;
        this.createFoldersIfNotExist(folderPath);
        return folderPath;
    }

    public getAppReportAllResultsFilePath(): string {
        const filePath = `${this.reportFolder}/${this.webApplication.name}/${CONSTANTS.ALL_RESULTS_ALL_KEYS}`;
        return filePath;
    }

    // public getApplicationChartDataSpecificFilePath(key: string): string {
    //     const filePath = `${this.getApplicationChartDataFolder()}/${key}.json`;
    //     return filePath;
    // }

    public getApplicationChartDataAllKeysFilePath(): string {
        const filePath = `${this.getWebApplicationReportFolderPath()}/${CONSTANTS.ALL_KEYS}`;
        return filePath;
    }

    public getAppAuditListReportFilePath(): string {
        return `${this.getWebApplicationReportFolderPath()}/${this.webApplication.name}_${CONSTANTS.AUDITLIST}.json`;
    }

    public getAppSummaryReportFilePath(): string {
        //create folders if they don't exist
        return `${this.getWebApplicationReportFolderPath()}/${this.webApplication.name}_${CONSTANTS.SUMMARY}.json`;
    }

    // public getAnalysisReportFilePath(throttledAuditGroupId: string, cpuSlowDownMultiplier: number, networkSpeed: any): string {
    //     //create folders if they don't exist
    //     return `${this.getAnalysisListReportFolderPath(throttledAuditGroupId)}/${throttledAuditGroupId}_${CONSTANTS.CPU}_${cpuSlowDownMultiplier}_${CONSTANTS.NETWORK}_${networkSpeed.throughputKbps}.json`;
    // }

    public getChartDataReportFolderPath(throttledAuditGroupId: string): string {
        //create folders if they don't exist
        var folderPath = `${this.getWebPageAuditReportFolderPath(throttledAuditGroupId)}/${CONSTANTS.CHARTDATA}`
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }

    // public getThrottledAuditGroupThrottleImpactReportFilePath(throttledAuditGroupId: string): string {
    //     //create folders if they don't exist
    //     var filePath = `${this.getChartDataReportFolderPath(throttledAuditGroupId)}/${CONSTANTS.WEB_PAGE_THROTTLED_AUDIT_THROTTLE_IMPACT_REPORT_FILE_NAME}`
    //     return filePath;
    // }
}