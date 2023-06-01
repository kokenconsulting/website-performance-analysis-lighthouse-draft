import * as fs from 'fs';
import { BaseReport } from '../base/BaseReport.js';

export class AuditListReport extends BaseReport {
    constructor(webPage,webApplication, reportFolder,logger) {
        super(webPage,webApplication, reportFolder,logger);
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
        const auditGroupId = auditSummaryObject.auditResultList[0].auditGroupId;
        const startDateTime = auditSummaryObject.auditResultList[0].startDateTime;
        const endDateTime = auditSummaryObject.auditResultList[0].endDateTime;
        const auditExists = this.auditList.audits.find(audit => audit.auditGroupId === auditGroupId);
        if (!auditExists) {
            this.auditList.audits.push({
                auditGroupId: auditGroupId,
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
        const auditListFolderPath = this.getWebPageAuditFolderPath();
        this.logger.logInfo(`appFolderPath: ${auditListFolderPath}`);
        for (const auditFolder of fs.readdirSync(auditListFolderPath)) {
            if (!auditFolder.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
                continue;
            }
            const auditGroupId = auditFolder;
            this.logger.logInfo(`auditGroupId: ${auditGroupId}`);

            const auditSummaryFilePath = this.getThrottledAuditGroupSummaryReportFilePath(auditGroupId);
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