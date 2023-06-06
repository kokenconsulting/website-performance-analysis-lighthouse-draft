import { CONSTANTS } from './Constants.js';
import { ProcessLogger } from '../log/ProcessLogger_Rename.js';
import { WebPageModel } from '../webPage/WebPageModel.js';
import { WebApplicationModel } from '../webApplication/WebApplicationModel.js';
import { WebApplicationBaseReport } from './WebApplicationBaseReport.js';

export class WebPageBaseReport extends WebApplicationBaseReport{
    protected webPage: WebPageModel;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, reportFolder: string, logger: ProcessLogger) {
        super(webApplication, reportFolder, logger)
        this.webPage = webPage;
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

  
    public getChartDataReportFolderPath(throttledAuditGroupId: string): string {
        //create folders if they don't exist
        var folderPath = `${this.getWebPageAuditReportFolderPath(throttledAuditGroupId)}/${CONSTANTS.CHARTDATA}`
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }

}