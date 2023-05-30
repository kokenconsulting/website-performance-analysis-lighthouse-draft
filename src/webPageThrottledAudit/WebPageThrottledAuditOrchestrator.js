import * as fs from 'fs';
import * as path from 'path';
import { WebPageThrottledAuditConfiguration } from './WebPageThrottledAuditConfiguration.js';
import { ThrottlingSettings } from '../throttling/ThrottlingSettings.js';
import { WebApplication } from '../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../webPage/WebPageModel.js';
import { WebPageThrottledAuditEngine } from './WebPageThrottledAuditEngine.js';
import { ProcessLogger } from '../log/ProcessLogger_Rename.js';
import { AuditListReport } from '../webApplication/AuditListReport.js';
import { WebApplicationThrottledAuditResultsReport } from '../webApplication/WebApplicationThrottledAuditResultsReport.js';
export class WebPageThrottledAuditOrchestrator {
    //constructor(webApplication, url, reportFolder, logger, auditInstanceId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    constructor(configFileFullPath) {
        this.logger = new ProcessLogger();
        this.config = JSON.parse(fs.readFileSync(configFileFullPath, 'utf8'));
        const reportFolderFullPath = path.join(process.cwd(), this.config.ReportFolderRelativePath);
        //print working directory
        //configuration
        this.webPage = new WebPageModel(this.config.WebPage.Url, this.config.WebPage.Name, this.config.WebPage.Description);
        this.webApplication = new WebApplication(
            this.config.Application.Name,
            this.config.Application.Version,
            this.config.Application.Description,
            this.config.Application.GitUrl,
            this.config.Application.GitBranch,
            this.config.Application.Environment
        );

        const throttlingSettings = new ThrottlingSettings(
            this.config.ThrottlingSettings.NetworkSpeeds,
            this.config.ThrottlingSettings.CPUSlowDownMultipliers
        );

        this.webPageAuditConfiguration = new WebPageThrottledAuditConfiguration(this.webPage, reportFolderFullPath, this.webApplication, throttlingSettings);
        //engine
        this.webpageThrottledAuditEngine = new WebPageThrottledAuditEngine(this.webPageAuditConfiguration, this.logger)
        //Reporters
        this.auditListReport = new AuditListReport(this.webApplication, reportFolderFullPath, this.logger);
        this.applicationAllResultsReport = new WebApplicationThrottledAuditResultsReport(this.webApplication, reportFolderFullPath, this.logger);
        this.WebPageThrottledAuditSummaryReport = new WebPageThrottledAuditSummaryReport(
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger,
            this.auditInstanceId
        );
        this.WebPageThrottledAuditSummaryChartReport = new WebPageThrottledAuditSummaryChartReport(

            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger,
            this.auditInstanceId
        );
    }

    async run(useExternalThrottling = true) {
        await this.runEngine(useExternalThrottling);
        await this.generateReports();
        
    };

    async runEngine(useExternalThrottling){
        await this.webpageThrottledAuditEngine.run(useExternalThrottling);
    }
    async generateReports(){
        await this.WebPageThrottledAuditSummaryReport.generate();
        this.WebPageThrottledAuditSummaryChartReport.generate();
        this.auditListReport.generate();
        this.applicationAllResultsReport.generate();
    }
}
