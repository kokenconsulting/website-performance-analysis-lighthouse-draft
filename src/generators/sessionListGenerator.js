import * as fs from 'fs';
import { logInfo } from '../log/processlogger.js';
import { getApplicationSessionListOutputPath, getSessionSummaryOutputPath, prepareRunsFolder, prepareAppVersionFolder } from '../utils/folder.js';

export class SessionListGenerator {
    constructor(webApplication, reportFolder) {
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;
        this.sessionList = {
            webApplication: webApplication,
            sessions: []
        };
    }
    generate() {
        logInfo(`Preparing session list for app ${this.webApplication.name}`);
        this.prepareSessionDataForApplication(getApplicationSessionListOutputPath, addToSessionList, preSave);
    }

    addToSessionList(sessionSummaryObject, sessionSummaryFilePath) {
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
    preSave() {
        this.sessionList.sessions.sort(function (a, b) {
            return new Date(a.startDateTime) - new Date(b.startDateTime);
        });
    }


    prepareSessionDataForApplication(fnGetSpecificAppSessionFilePath, fnSpecificAppSessionFileOperation, fnPreSave) {
        let appSpecificPurposeSessionListFilePath = fnGetSpecificAppSessionFilePath(this.webApplication, this.reportFolder);
        logInfo(`appSpecificPurposeSessionListFilePath: ${appSpecificPurposeSessionListFilePath}`)
        if (!fs.existsSync(appSpecificPurposeSessionListFilePath)) {
            fs.writeFileSync(appSpecificPurposeSessionListFilePath, JSON.stringify(this.sessionList), 'utf8');
        }
        const sessionListForApplication = JSON.parse(fs.readFileSync(appSpecificPurposeSessionListFilePath, 'utf8'));
        const runsFolder = prepareAppVersionFolder(this.webApplication, this.reportFolder);
        for (const sessionFolder of fs.readdirSync(runsFolder)) {
            if (!sessionFolder.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
                continue;
            }
            logInfo(`sessionFolder: ${sessionFolder}`);
            const sessionSummaryFilePath = getSessionSummaryOutputPath(this.webApplication, sessionFolder, this.reportFolder);
            const sessionSummaryObject = JSON.parse(fs.readFileSync(sessionSummaryFilePath, 'utf8'));
            fnSpecificAppSessionFileOperation(sessionSummaryObject, sessionSummaryFilePath,);
        }
        fnPreSave();
        fs.writeFileSync(appSpecificPurposeSessionListFilePath, JSON.stringify(this.sessionList), 'utf8');
        logInfo(`Session list written to ${appSpecificPurposeSessionListFilePath}`);
    }
}