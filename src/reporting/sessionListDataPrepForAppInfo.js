import * as fs from 'fs';
import { logInfo } from '../log/processlogger.js';
import { getApplicationSessionListOutputPath, getSessionSummaryOutputPath, prepareRunsFolder,prepareAppVersionFolder } from '../utils/folder.js';
// export a function that will loop over all the session folder under an application folder and will read a json file with the suffix summary.
// this function will read data from each summary.json file and will create a list of objects. Each object will have the following properties:
// sessionId
// networkSpeed
// cpuSlowDownMultiplier
// interactive result
// speed index
// date time of the analysis


export function prepareSessionListForApp(appInfo, reportFolder) {
    logInfo(`Preparing session list for app ${appInfo.projectName}`);
    prepareSessionDataForApplication(appInfo, reportFolder, getApplicationSessionListOutputPath, function () {
        
        return {
            appInfo: appInfo,
            sessions: []
        };
    }, function (appInfo, sessionSummaryFilePath, sessionListForApplication, sessionSummaryObject) {
        const sessionId = sessionSummaryObject[0].sessionId;
        const startDateTime = sessionSummaryObject[0].startDateTime;
        const endDateTime = sessionSummaryObject[0].endDateTime;
        // sample datetime value is 2023-05-25T16:01:02.920Z. Parse this string to get the date and time
        //if session id is not in the array, add it to the array
        const sessionExists = sessionListForApplication.sessions.find(session => session.sessionId === sessionId);
        if (!sessionExists) {
            sessionListForApplication.sessions.push({
                sessionId: sessionId,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                appVersion : appInfo.version
            });
            // const dateTimeParts = endDateTime.split('T');
            // const dateParts = dateTimeParts[0].split('-');
            // const timeParts = dateTimeParts[1].split(':');
            // const year = dateParts[0];
            // const month = dateParts[1];
            // const day = dateParts[2];
            // const hour = timeParts[0];
            // const minute = timeParts[1];
            // const second = timeParts[2].split('.')[0];
        }
    }, function (appInfo, sessionListForApplication) {
        //sort the sessions array by date time
        sessionListForApplication.sessions.sort(function (a, b) {
            return new Date(a.startDateTime) - new Date(b.startDateTime);
        }
        );
    });
}

export function prepareSessionDataForApplication(appInfo, reportFolder, fnGetSpecificAppSessionFilePath, fnGetInitialObject, fnSpecificAppSessionFileOperation, fnPreSave) {
    //read json file object and store in an object
    //let sessionListFilePath = getApplicationSessionListOutputPath(appInfo, reportFolder);
    let appSpecificPurposeSessionListFilePath = fnGetSpecificAppSessionFilePath(appInfo, reportFolder);
    logInfo(`appSpecificPurposeSessionListFilePath: ${appSpecificPurposeSessionListFilePath}`)
    //if file does not exist, create an empty array and write to file
    if (!fs.existsSync(appSpecificPurposeSessionListFilePath)) {

        let initialObject = fnGetInitialObject(appInfo);
        fs.writeFileSync(appSpecificPurposeSessionListFilePath, JSON.stringify(initialObject), 'utf8');
    }
    const sessionListForApplication = JSON.parse(fs.readFileSync(appSpecificPurposeSessionListFilePath, 'utf8'));
    const runsFolder = prepareAppVersionFolder(appInfo, reportFolder);
    for (const sessionFolder of fs.readdirSync(runsFolder)) {
        //ignore sessionFolder that is not a uuidv4
        if (!sessionFolder.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
            continue;
        }
        logInfo(`sessionFolder: ${sessionFolder}`);
        //read the summary.json file
        const sessionSummaryFilePath = getSessionSummaryOutputPath(appInfo, sessionFolder, reportFolder);
        const sessionSummaryObject = JSON.parse(fs.readFileSync(sessionSummaryFilePath, 'utf8'));
        fnSpecificAppSessionFileOperation(appInfo, sessionSummaryFilePath, sessionListForApplication, sessionSummaryObject);
    }
    fnPreSave(appInfo, sessionListForApplication);
    fs.writeFileSync(appSpecificPurposeSessionListFilePath, JSON.stringify(sessionListForApplication), 'utf8');

}