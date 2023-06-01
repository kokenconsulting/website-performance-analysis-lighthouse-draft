import * as fs from 'fs';
import * as path from 'path';
import { WebPageThrottledAuditConfiguration } from '../webPageThrottledAudit/WebPageThrottledAuditConfiguration.js';
import { ThrottlingSettings } from '../throttling/ThrottlingSettings.js';
import { WebApplication } from '../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../webPage/WebPageModel.js';
import { WebPageThrottledAuditEngine } from '../webPageThrottledAudit/WebPageThrottledAuditEngine.js';
import { ProcessLogger } from '../log/ProcessLogger_Rename.js';
import { AuditListReport } from '../webApplication/AuditListReport.js';
import { WebApplicationThrottledAuditResultsReport } from '../webApplication/WebApplicationThrottledAuditResultsReport.js';
import { WebPageThrottledAuditSummaryReport } from '../webPageThrottledAudit/reports/WebPageThrottledAuditSummaryReport.js'
import { WebPageThrottledAuditSummaryChartData } from '../webPageThrottledAudit/chart/WebPageThrottledAuditSummaryChartData.js'
import { WebPageEnvironmentAuditListReport } from '../webPageEnvironment/report/WebPageEnvironmentAuditListReport.js'
import { WebPageEnvironmentListReport } from '../webPage/report/WebPageEnvironmentListReport.js'
import { WebApplicationWebPageListReport } from '../webApplication/report/WebApplicationWebPageListReport.js'
import { EnvironmentAuditResultsChartData } from '../webPageEnvironment/chart/EnvironmentAuditResultsChartData.js'
import { WebApplicationListReport } from './WebApplicationListReport.js'
export class WebPageThrottledAuditOrchestrator {
    //constructor(webApplication, url, reportFolder, logger, auditInstanceId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    constructor(configFileFullPath) {
        this.logger = new ProcessLogger();
        this.config = JSON.parse(fs.readFileSync(configFileFullPath, 'utf8'));
        const reportFolderFullPath = path.join(process.cwd(), this.config.ReportFolderRelativePath);
        //print working directory
        //configuration
        this.webPage = new WebPageModel(this.config.WebPage.Url, this.config.WebPage.Id, this.config.WebPage.Name, this.config.WebPage.Environment, this.config.WebPage.Description);
        this.webApplication = new WebApplication(
            this.config.Application.Id,
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
        this.auditListReport = new AuditListReport(this.webPage, this.webApplication, reportFolderFullPath, this.logger);
        this.applicationAllResultsReport = new WebApplicationThrottledAuditResultsReport(this.webPage, this.webApplication, reportFolderFullPath, this.logger);
        // this.WebApplicationThrottledAuditResultsReport = new WebApplicationThrottledAuditResultsReport(
        //     this.webPage,
        //     this.webPageAuditConfiguration.webApplication,
        //     this.webPageAuditConfiguration.reportFolderFullPath,
        //     this.logger,
        //     this.auditInstanceId
        // );

    }

    async run(useExternalThrottling = true) {
        const auditInstanceId = await this.runEngine(useExternalThrottling);
        await this.generateReports(auditInstanceId);
        await this.generateCharts(auditInstanceId);
    };

    async runEngine(useExternalThrottling) {
        return await this.webpageThrottledAuditEngine.run(useExternalThrottling);
    }
    async generateCharts(auditInstanceId) {
        const webPageThrottledAuditSummaryChartData = new WebPageThrottledAuditSummaryChartData(
            this.webPage,
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger,
            auditInstanceId
        );
        webPageThrottledAuditSummaryChartData.generate();

        const environmentAuditResultsChartData = new EnvironmentAuditResultsChartData(
            this.webPage,
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger
        );
        await environmentAuditResultsChartData.generate();
    }
    async generateReports(auditInstanceId) {
        const webPageThrottledAuditSummaryReport = new WebPageThrottledAuditSummaryReport(
            this.webPage,
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger,
            auditInstanceId
        );
        await webPageThrottledAuditSummaryReport.generate();

        const webPageEnvironmentAuditListReport = new WebPageEnvironmentAuditListReport(
            this.webPage,
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger
        );
        await webPageEnvironmentAuditListReport.generate();
        const webPageEnvironmentListReport = new WebPageEnvironmentListReport(
            this.webPage,
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger
        );
        await webPageEnvironmentListReport.generate();
        const webApplicationWebPageListReport = new WebApplicationWebPageListReport(
            this.webPage,
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger
        );
        await webApplicationWebPageListReport.generate();
        const webApplicationListReport = new WebApplicationListReport(
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger
        )
        webApplicationListReport.generate();
    }
}
