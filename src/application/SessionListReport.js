import * as fs from 'fs';
import { BaseReport } from '../base/BaseReport.js';

export class SessionListReport extends BaseReport {
    constructor(webApplication, reportFolder,logger) {
        super(webApplication, reportFolder,logger);
        this.sessionList = {
            webApplication: webApplication,
            sessions: []
        };
        this.sessionListFilePath = this.getAppSessionListReportFilePath();
    }
    generate() {
        this.logger.logInfo(`Preparing session list for app ${this.webApplication.name}`);
        this.prepareSessionDataForApplication();
    }

    addToSessionList(sessionSummaryObject) {
        const sessionId = sessionSummaryObject[0].sessionId;
        const startDateTime = sessionSummaryObject[0].startDateTime;
        const endDateTime = sessionSummaryObject[0].endDateTime;
        const sessionExists = this.sessionList.sessions.find(session => session.sessionId === sessionId);
        if (!sessionExists) {
            this.sessionList.sessions.push({
                sessionId: sessionId,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                appVersion: this.webApplication.version
            });
        }
    }
    sortSessionList() {
        this.sessionList.sessions.sort(function (a, b) {
            return new Date(a.startDateTime) - new Date(b.startDateTime);
        });
    }


    prepareSessionDataForApplication() {
        const appFolderPath = this.getAppReportFolderPath();
        this.logger.logInfo(`appFolderPath: ${appFolderPath}`);
        for (const sessionFolder of fs.readdirSync(appFolderPath)) {
            if (!sessionFolder.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
                continue;
            }
            logInfo(`sessionFolder: ${sessionFolder}`);
            const sessionSummaryFilePath = getSessionSummaryOutputPath(this.webApplication, sessionFolder, this.reportFolder);
            const sessionSummaryObject = JSON.parse(fs.readFileSync(sessionSummaryFilePath, 'utf8'));
            addToSessionList(sessionSummaryObject, sessionSummaryFilePath);
        }
        this.sortSessionList();
        this.saveReport();
    }

    saveReport() {
        fs.writeFileSync(this.sessionListFilePath, JSON.stringify(this.sessionList), 'utf8');
    }
    getReport() {
        //read file
        return JSON.parse(fs.readFileSync(this.sessionListFilePath, 'utf8'));
    }
    checkIfReportFileExists() {
        return fs.existsSync(this.sessionListFilePath);
    }
}