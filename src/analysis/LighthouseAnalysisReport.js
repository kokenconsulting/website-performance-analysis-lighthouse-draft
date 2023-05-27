import { BaseReport } from "../base/BaseReport";
import { AnalysisResultModel } from "../models/AnalysisResultModel";

export class LighthouseAnalysisReport extends BaseReport {
    constructor(appInfo, reportFolder, sessionId, cpuSlowDownMultiplier=null, networkSpeed=null) {
        super(reportFolder);
        this.appInfo = appInfo;
        this.sessionId = sessionId;
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.networkSpeed = networkSpeed;
        this.anaylsisReportPath = this.getAnalysisReportFilePath(sessionId, cpuSlowdownMultiplier, networkSpeed);
    }

    saveReport(jsonReport) {
        
        fs.writeFileSync(anaylsisReportPath, JSON.stringify(jsonReport), 'utf8');
        logInfo(`Analysis report written to ${this.anaylsisReportPath}`);
    }

    getReport() {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.anaylsisReportPath, 'utf8');
        return JSON.parse(data);
    }
  
    getReportAsAnalysisResultModel() {
         //get analysis end time from jsonReport
         const jsonReport = this.getReport();
         //TODO - get date from report
         const analysisEndTime = new Date();
         const extractedNumericValues = extractNumericValue(jsonReport.audits);
         var networkSpeed = jsonReport.configSettings.externalNetworkSpeed.throughputKbps;
         var cpuSlowDownMultiplier = jsonReport.configSettings.throttling.cpuSlowdownMultiplier;
         const interactiveResultInMilliseconds = extractedNumericValues["interactive"];
         const speedIndexResultinMilliseconds = extractedNumericValues["speed-index"];
         logInfo(`Interactive result is ${interactiveResultInMilliseconds} and speed index result is ${speedIndexResultinMilliseconds}`);
         return new AnalysisResultModel(appInfo, sessionId, appInfo.initiatedBy, appInfo.environment, jsonReport.fetchTime, analysisEndTime, networkSpeed, cpuSlowDownMultiplier, interactiveResultInMilliseconds, speedIndexResultinMilliseconds);
    }
    extractNumericValue(jsonObject) {
        const numericValuesObj = {};
        function traverse(obj) {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverse(obj[key]);
                } else if (key === 'numericValue') {
                    numericValuesObj[obj["id"]] = obj[key]
                }
            }
        }
        traverse(jsonObject);
        return numericValuesObj;
    }
}
