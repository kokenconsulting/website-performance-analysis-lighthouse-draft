import { BaseReport } from "../base/BaseReport.js";
import { CONSTANTS } from "../base/Constants.js";
import * as fs from 'fs';
import * as path from 'path';

export class LighthouseAuditReport extends BaseReport {
    constructor(webPage,webApplication, reportFolder, logger, throttledAuditGroupId, cpuSlowDownMultiplier, networkSpeed) {
        super(webPage,webApplication, reportFolder, logger);
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.networkSpeed = networkSpeed;
        this.logger.logInfo(`Creating analysis report for throttled audit group ${this.throttledAuditGroupId} with cpu slowdown multiplier ${cpuSlowDownMultiplier} and network speed ${networkSpeed}`);
        this.reportFileName = this.getReportFilePath();
    }
    getLighthouseAuditReportFolderPath() {
        //create folders if they don't exist
        const folderPath = `${this.getWebPageAuditFolderPath()}/${this.throttledAuditGroupId}/${CONSTANTS.LIGHTHOUSE}`;
        this.createFoldersIfNotExist(folderPath)
        return folderPath;
    }
    getReportFilePath() {
        const fileName = `${this.webApplication.name}_${this.throttledAuditGroupId}_${CONSTANTS.LIGHTHOUSE}_cpu_${this.cpuSlowDownMultiplier}_network_${this.networkSpeed.throughputKbps}.json`;
        return path.join(this.getLighthouseAuditReportFolderPath(this.throttledAuditGroupId), fileName);
    }
    saveReport(jsonReport) {
        fs.writeFileSync(this.reportFileName, JSON.stringify(jsonReport), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.reportFileName}`);
    }

    getReport() {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.reportFileName, 'utf8');
        return JSON.parse(data);
    }


}
