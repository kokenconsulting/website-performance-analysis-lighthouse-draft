import * as fs from 'fs';
import { CONSTANTS } from './Constants.js';
import { ProcessLogger } from '../Log/ProcessLogger.js';

export class ProcessMonitorBaseReport {
    
    protected reportFolder: string;
    protected logger: ProcessLogger;

    constructor(reportFolder: string, logger: ProcessLogger) {
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
}