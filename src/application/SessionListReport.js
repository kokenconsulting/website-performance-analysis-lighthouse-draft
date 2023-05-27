import * as fs from 'fs';
import { logInfo } from '../log/Processlogger.js';
import { BaseReport } from '../base/BaseReport.js';

export class SessionListReport extends BaseReport {
    constructor(appInfo, reportFolder) {
        this.appInfo = appInfo;
        this.reportFolder = reportFolder;
        this.sessionList = {
            appInfo: appInfo,
            sessions: []
        };
        this.sessionListFilePath = this.getAppSessionListReportFilePath();
    }
    generate() {
        logInfo(`Preparing session list for app ${this.appInfo.projectName}`);
        this.prepareSessionDataForApplication(getApplicationSessionListOutputPath, addToSessionList, preSave);
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
                appVersion: this.appInfo.version
            });
        }
    }
    sortSessionList() {
        this.sessionList.sessions.sort(function (a, b) {
            return new Date(a.startDateTime) - new Date(b.startDateTime);
        });
    }


    prepareSessionDataForApplication() {
        let appFolderPath = this.getAppReportFolderPath();
        logInfo(`appSpecificPurposeSessionListFilePath: ${appSpecificPurposeSessionListFilePath}`)
       
        for (const sessionFolder of fs.readdirSync(appFolderPath)) {
            if (!sessionFolder.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
                continue;
            }
            logInfo(`sessionFolder: ${sessionFolder}`);
            const sessionSummaryFilePath = getSessionSummaryOutputPath(this.appInfo, sessionFolder, this.reportFolder);
            const sessionSummaryObject = JSON.parse(fs.readFileSync(sessionSummaryFilePath, 'utf8'));
            addToSessionList(sessionSummaryObject, sessionSummaryFilePath);
        }
        sortSessionList();
        this.saveReport(appSpecificPurposeSessionListFilePath);
    }

    saveReport(appSpecificPurposeSessionListFilePath) {
        fs.writeFileSync(this.sessionListFilePath, JSON.stringify(this.sessionList), 'utf8');
        logInfo(`Session list written to ${appSpecificPurposeSessionListFilePath}`);
    }
    getReport() {
        //read file
        return JSON.parse(fs.readFileSync(this.sessionListFilePath, 'utf8'));
    }
    checkIfReportFileExists() {
        return fs.existsSync(this.sessionListFilePath);
    }
}