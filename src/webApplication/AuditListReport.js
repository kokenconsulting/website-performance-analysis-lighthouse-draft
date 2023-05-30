import * as fs from 'fs';
import { BaseReport } from '../base/BaseReport.js';

export class AuditListReport extends BaseReport {
    constructor(webApplication, reportFolder,logger) {
        super(webApplication, reportFolder,logger);
        this.auditList = {
            webApplication: webApplication,
            audits: []
        };
        this.auditListFilePath = this.getAppAuditListReportFilePath();
    }
    generate() {
        this.logger.logInfo(`Preparing session list for app ${this.webApplication.name}`);
        this.prepareAuditDataForApplication();
    }

    addToAuditList(auditSummaryObject) {
        const auditInstanceId = auditSummaryObject.auditResultList[0].auditInstanceId;
        const startDateTime = auditSummaryObject.auditResultList[0].startDateTime;
        const endDateTime = auditSummaryObject.auditResultList[0].endDateTime;
        const auditExists = this.auditList.audits.find(audit => audit.auditInstanceId === auditInstanceId);
        if (!auditExists) {
            this.auditList.audits.push({
                auditInstanceId: auditInstanceId,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                appVersion: this.webApplication.version
            });
        }
    }
    sortAuditList() {
        this.auditList.audits.sort(function (a, b) {
            return new Date(a.startDateTime) - new Date(b.startDateTime);
        });
    }


    prepareAuditDataForApplication() {
        const auditListFolderPath = this.getAuditFolderPath();
        this.logger.logInfo(`appFolderPath: ${auditListFolderPath}`);
        for (const auditFolder of fs.readdirSync(auditListFolderPath)) {
            if (!auditFolder.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
                continue;
            }
            const auditInstanceId = auditFolder;
            this.logger.logInfo(`auditInstanceId: ${auditInstanceId}`);

            const auditSummaryFilePath = this.getWebPageThrottledAuditSummaryReportFilePath(auditInstanceId);
            const auditSummaryObject = JSON.parse(fs.readFileSync(auditSummaryFilePath, 'utf8'));
            this.addToAuditList(auditSummaryObject);
        }
        this.sortAuditList();
        this.saveReport();
    }

    saveReport() {
        fs.writeFileSync(this.auditListFilePath, JSON.stringify(this.auditList), 'utf8');
    }
    getReport() {
        //read file
        return JSON.parse(fs.readFileSync(this.auditListFilePath, 'utf8'));
    }
    checkIfReportFileExists() {
        return fs.existsSync(this.auditListFilePath);
    }
}