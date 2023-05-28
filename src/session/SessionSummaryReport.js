import { BaseReport } from "../base/BaseReport.js";
import { LighthouseAnalysisReport } from "../analysis/LighthouseAnalysisReport.js";
import { SessionSummaryModel } from "./SessionSummaryModel.js";
import * as fs from 'fs';
import * as path from 'path';
export class SessionSummaryReport extends BaseReport {
    constructor(appInfo, reportFolder, logger,sessionId) {
        super(appInfo, reportFolder,logger);
        this.appInfo = appInfo;
        this.sessionId = sessionId;
        this.sessionSummaryReportFilePath = this.getSessionSummaryReportFilePath(sessionId);
    }
    async generate() {
        try {
            const analysisResultList = await this.getAnalysisResultList();
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
        this.logger.logInfo(`Session run folder path is ${sessionRunFolderPath}`);
        const files = await fs.promises.readdir(sessionRunFolderPath);
        for (const file of files) {
            if (file.startsWith(this.sessionId)) {
                const filePath = path.join(sessionRunFolderPath, file);
                this.logger.logInfo(`File path is ${filePath}`);
                fileList.push(filePath);
            }

        }
        return fileList;
    }

    async getAnalysisResultList() {
        const files = await this.getSessionFilePathList()
        const analysisResultList = [];
        for (const filePath of files) {
            const data = await fs.promises.readFile(filePath, 'utf8');
            try {
                const jsonReport = JSON.parse(data);
                //TODO - get from proper path
                var cpuSlowDownMultiplier = jsonReport.configSettings.customSettings.providedCPUSlowDownMultiplier;
                var networkSpeed = jsonReport.configSettings.customSettings.providedNetworkThrottling;
                var lighthouseAnalysisReport = new LighthouseAnalysisReport(this.appInfo, this.reportFolder, this.logger, this.sessionId, cpuSlowDownMultiplier, networkSpeed);
                var analysisResultReport = lighthouseAnalysisReport.getReportAsAnalysisResultModel();
                analysisResultList.push(analysisResultReport);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        return analysisResultList;
    }


    saveReport(sessionSummaryReportObject) {

        fs.writeFileSync(this.sessionSummaryReportFilePath, JSON.stringify(sessionSummaryReportObject), 'utf8');
        this.logger.logInfo(`Analysis report written to ${this.sessionSummaryReportFilePath}`);
    }

    getReport() {
        //read the file from analysis report path and parse into json
        const data = fs.readFileSync(this.sessionSummaryReportFilePath, 'utf8');
        return JSON.parse(data);
    }

}
