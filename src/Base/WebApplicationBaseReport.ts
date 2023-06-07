import { CONSTANTS } from './Constants.js';
import { ProcessLogger } from '../Log/ProcessLogger.js';
import { WebApplicationModel } from '../WebApplication/WebApplicationModel.js';
import { ProcessMonitorBaseReport } from './ProcessMonitorBaseReport.js';

export class WebApplicationBaseReport extends ProcessMonitorBaseReport{
    protected webApplication: WebApplicationModel;
    protected reportFolder: string;
    protected logger: ProcessLogger;

    constructor(webApplication: WebApplicationModel, reportFolder: string, logger: ProcessLogger) {
        super(reportFolder, logger)
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;
        this.logger = logger;
    }

    public getWebApplicationReportFolderPath(): string {
        const folderPath = `${this.getReportFolderPath()}/${this.webApplication.id}`;
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
}