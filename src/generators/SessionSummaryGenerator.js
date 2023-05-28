import * as path from 'path';
import * as fs from 'fs';
import { logInfo } from '../log/processlogger.js'
import { AnalysisResult } from '../models/AnalysisResultModel.js';
import { extractNumericValue, prepareSessionReportFolder, getSessionSummaryOutputPath } from '../utils/folder.js';
import { SessionSummaryModel } from '../models/SessionSummaryModel.js';

export class SessionSummaryGenerator {
    constructor(webApplication, reportFolder) {
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;
    }

    async generate(sessionId) {
        try {
            const analysisResultList = await this.getAnalysisResultList(files, sessionId);
            var sessionSummary = new SessionSummaryModel(this.webApplication, analysisResultList);
            const sessionReportOutputPath = await this.writeSessionSummaryToFile(sessionSummary);
            return sessionReportOutputPath;
        } catch (err) {
            console.error('Error:', err);
        }
        return null;

    }
    async getAnalysisResultList( sessionId) {
        const files = await this.getSessionFilePathList(sessionRunFolderPath, sessionId);
        const analysisResultList = [];
        for (const filePath of files) {
            logInfo(`createSummaryForSession --- file path is ${filePath}`);
            const data = await fs.promises.readFile(filePath, 'utf8');
            try {
                const jsonReport = JSON.parse(data);
                analysisResultList.push(createAnalysisResult(sessionId, jsonReport, loadTimeData));
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        return analysisResultList;
    }

    async writeSessionSummaryToFile(sessionSummary) {
        const sessionReportOutputPath = getSessionSummaryOutputPath(webApplication, sessionId, reportFolder);
        await fs.promises.writeFile(sessionReportOutputPath, sessionSummary.toJson(), 'utf8');
        return sessionReportOutputPath;
    }

    async getSessionFilePathList(sessionId) {
        var fileList = [];
        const sessionRunFolderPath = prepareSessionReportFolder(this.webApplication, sessionId, this.reportFolder);
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

   
}