import { BaseReport } from "../base/BaseReport";
import { LighthouseAnalysisReport } from "../analysis/LighthouseAnalysisReport";
import { SessionSummaryModel } from "../models/SessionSummaryModel";

export class SessionSummaryReport extends BaseReport {
    constructor(appInfo, reportFolder, sessionId) {
        super(appInfo, reportFolder);
        this.appInfo = appInfo;
        this.sessionId = sessionId;
        this.sessionSummaryReportFilePath = this.getSessionSummaryReportFilePath(sessionId, cpuSlowdownMultiplier, networkSpeed);
    }
    async generate() {
        try {
            const analysisResultList = await this.getAnalysisResultList(files, sessionId);
            var sessionSummary = new SessionSummaryModel(this.appInfo, analysisResultList);
            this.saveReport(sessionSummary);
        } catch (err) {
            console.error('Error:', err);
        }
        return null;
    }

    async getSessionFilePathList() {
        var fileList = [];
        const sessionRunFolderPath = await this.getAnalysisListReportFolderPath(this.sessionId);
        const files = await fs.promises.readdir(sessionRunFolderPath);
        for (const file of files) {
            if (file.startsWith(sessionId)) {
                const filePath = path.join(sessionReportsFolder, file);
                logInfo(`File path is ${filePath}`);
                fileList.push(filePath);
            }

        }
        return fileList;
    }

    async getAnalysisResultList() {
        const files = getSessionFilePathList()
        const analysisResultList = [];
        for (const filePath of files) {
            const data = await fs.promises.readFile(filePath, 'utf8');
            try {
                const jsonReport = JSON.parse(data);
                //TODO - get from proper path
                var cpuSlowDownMultiplier = jsonReport['cpuSlowdownMultiplier'];
                var networkSpeed = jsonReport['networkSpeed'];
                var lighthouseAnalysisReport = new LighthouseAnalysisReport(this.appInfo, this.reportFolder, this.sessionId, cpuSlowDownMultiplier, networkSpeed);
                var analysisResultReport = lighthouseAnalysisReport.getReportAsAnalysisResultModel();
                analysisResultList.push(analysisResultReport);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        return analysisResultList;
    }


    saveReport(sessionSummaryReportObject) {

        fs.writeFileSync(sessionSummaryReportFilePath, JSON.stringify(sessionSummaryReportObject), 'utf8');
        logInfo(`Analysis report written to ${this.sessionSummaryReportFilePath}`);
    }

    getReport() {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.sessionSummaryReportFilePath, 'utf8');
        return JSON.parse(data);
    }

}
