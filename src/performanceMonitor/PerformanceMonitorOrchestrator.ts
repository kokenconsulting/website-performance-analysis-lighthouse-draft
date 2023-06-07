import * as fs from 'fs';
import * as path from 'path';
import { ThrottledAuditGroupConfiguration } from '../ThrottledAuditGroup/ThrottledAuditGroupConfiguration.js';
import { ThrottlingSettings } from '../throttling/ThrottlingSettings.js';
import { WebApplicationModel } from '../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../webPage/WebPageModel.js';
import { ThrottledAuditGroupEngine } from '../ThrottledAuditGroup/ThrottledAuditGroupEngine.js';
import { ProcessLogger } from '../log/ProcessLogger.js';
//import { AuditListReport } from '../webApplication/AuditListReport.js';
//import { WebApplicationThrottledAuditResultsReport } from '../webApplication/WebApplicationThrottledAuditResultsReport.js';
import { ThrottledAuditGroupSummaryReport } from '../ThrottledAuditGroup/reports/ThrottledAuditGroupSummaryReport.js'
import { ThrottledAuditGroupSummaryChartData } from '../ThrottledAuditGroup/chart/ThrottledAuditGroupSummaryChartData.js'
import { WebPageEnvironmentAuditListReport } from '../Environment/report/WebPageEnvironmentAuditListReport.js'
import { WebApplicationListReport } from './WebApplicationListReport.js';
import { WebApplicationWebPageListReport } from '../webApplication/report/WebApplicationWebPageListReport.js';
import { WebPageEnvironmentListReport } from '../webPage/report/WebPageEnvironmentListReport.js';
import { EnvironmentAuditResultsChartData } from '../Environment/chart/EnvironmentAuditResultsChartData.js';


export class PerformanceMonitorOrchestrator {
    private logger: ProcessLogger;
    private config: any;
    private webPage: WebPageModel;
    private webApplication: WebApplicationModel;
    private webPageAuditConfiguration: ThrottledAuditGroupConfiguration;
    private webpageThrottledAuditEngine: ThrottledAuditGroupEngine;
    // private auditListReport: AuditListReport;
    // private applicationAllResultsReport: WebApplicationThrottledAuditResultsReport;

    constructor(configFileFullPath: string) {
        this.logger = new ProcessLogger();
        this.config = JSON.parse(fs.readFileSync(configFileFullPath, 'utf8'));
        const reportFolderFullPath = path.join(process.cwd(), this.config.ReportFolderRelativePath);

        this.webPage = new WebPageModel(
            this.config.WebPage.Url,
            this.config.WebPage.Id,
            this.config.WebPage.Name,
            this.config.WebPage.Environment,
            this.config.WebPage.Description
        );

        this.webApplication = new WebApplicationModel(
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

        this.webPageAuditConfiguration = new ThrottledAuditGroupConfiguration(
            this.webPage,
            reportFolderFullPath,
            this.webApplication,
            throttlingSettings
        );

        this.webpageThrottledAuditEngine = new ThrottledAuditGroupEngine(
            this.webPageAuditConfiguration,
            this.logger
        );

        // this.auditListReport = new AuditListReport(
        //     this.webPage,
        //     this.webApplication,
        //     reportFolderFullPath,
        //     this.logger
        // );

        // this.applicationAllResultsReport = new WebApplicationThrottledAuditResultsReport(
        //     this.webPage,
        //     this.webApplication,
        //     reportFolderFullPath,
        //     this.logger
        // );
    }

    public async run(useExternalThrottling = true): Promise<void> {
        const throttledAuditGroupId = await this.runEngine(useExternalThrottling);
        await this.generateReports(throttledAuditGroupId);
        await this.generateCharts(throttledAuditGroupId);
    }

    private async runEngine(useExternalThrottling: boolean): Promise<string> {
        return await this.webpageThrottledAuditEngine.run(useExternalThrottling);
    }

    private async generateCharts(throttledAuditGroupId: string): Promise<void> {
        const webPageThrottledAuditSummaryChartData = new ThrottledAuditGroupSummaryChartData(
            this.webPage,
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger,
            throttledAuditGroupId
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

    private async generateReports(throttledAuditGroupId: string): Promise<void> {
        const webPageThrottledAuditSummaryReport = new ThrottledAuditGroupSummaryReport(
            this.webPage,
            this.webPageAuditConfiguration.webApplication,
            this.webPageAuditConfiguration.reportFolderFullPath,
            this.logger,
            throttledAuditGroupId
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
        );
        webApplicationListReport.generate();
    }
}
