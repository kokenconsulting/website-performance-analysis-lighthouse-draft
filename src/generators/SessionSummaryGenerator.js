import * as path from 'path';
import * as fs from 'fs';
import { logInfo } from '../log/processlogger.js'
import { AnalysisResult } from '../models/AuditResultModel.js';
import { extractNumericValue, prepareSessionReportFolder, getSessionSummaryOutputPath } from '../utils/folder.js';
import { WebPageThrottledAuditSummaryModel } from '../models/WebPageThrottledAuditSummaryModel.js';

export class SessionSummaryGenerator {
    constructor(webApplication, reportFolder) {
        this.webApplication = webApplication;
        this.reportFolder = reportFolder;
    }

    async generate(auditInstanceId) {
        try {
            const auditResultList = await this.getAnalysisResultList(files, auditInstanceId);
            var sessionSummary = new WebPageThrottledAuditSummaryModel(this.webApplication, auditResultList);
            const sessionReportOutputPath = await this.writeSessionSummaryToFile(sessionSummary);
            return sessionReportOutputPath;
        } catch (err) {
            console.error('Error:', err);
        }
        return null;

    }
    async getAnalysisResultList( auditInstanceId) {
        const files = await this.getSessionFilePathList(sessionRunFolderPath, auditInstanceId);
        const auditResultList = [];
        for (const filePath of files) {
            logInfo(`createSummaryForSession --- file path is ${filePath}`);
            const data = await fs.promises.readFile(filePath, 'utf8');
            try {
                const jsonReport = JSON.parse(data);
                auditResultList.push(createAnalysisResult(auditInstanceId, jsonReport, loadTimeData));
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        return auditResultList;
    }

    async writeSessionSummaryToFile(sessionSummary) {
        const sessionReportOutputPath = getSessionSummaryOutputPath(webApplication, auditInstanceId, reportFolder);
        await fs.promises.writeFile(sessionReportOutputPath, sessionSummary.toJson(), 'utf8');
        return sessionReportOutputPath;
    }

    async getSessionFilePathList(auditInstanceId) {
        var fileList = [];
        const sessionRunFolderPath = prepareSessionReportFolder(this.webApplication, auditInstanceId, this.reportFolder);
        const files = await fs.promises.readdir(sessionRunFolderPath);
        for (const file of files) {
            if (file.startsWith(auditInstanceId)) {
                const filePath = path.join(sessionReportsFolder, file);
                logInfo(`File path is ${filePath}`);
                fileList.push(filePath);
            }

        }
        return fileList;
    }

   
}