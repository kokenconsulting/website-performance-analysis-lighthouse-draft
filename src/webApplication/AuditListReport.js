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
        const throttledAuditGroupId = auditSummaryObject.auditResultList[0].throttledAuditGroupId;
        const startDateTime = auditSummaryObject.auditResultList[0].startDateTime;
        const endDateTime = auditSummaryObject.auditResultList[0].endDateTime;
        const auditExists = this.auditList.audits.find(audit => audit.throttledAuditGroupId === throttledAuditGroupId);
        if (!auditExists) {
            this.auditList.audits.push({
                throttledAuditGroupId: throttledAuditGroupId,
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
            const throttledAuditGroupId = auditFolder;
            this.logger.logInfo(`throttledAuditGroupId: ${throttledAuditGroupId}`);

            const auditSummaryFilePath = this.getThrottledAuditGroupSummaryReportFilePath(throttledAuditGroupId);
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