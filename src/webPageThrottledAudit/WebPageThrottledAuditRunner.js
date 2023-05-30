import * as fs from 'fs';
import * as path from 'path';
import { WebPageThrottledAuditConfiguration } from './WebPageThrottledAuditConfiguration.js';
import { ThrottlingSettings } from '../throttling/ThrottlingSettings.js';
import { WebApplication } from '../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../webPage/WebPageModel.js';
import { WebPageThrottledAuditEngine } from './WebPageThrottledAuditEngine.js';
import { ProcessLogger } from '../log/ProcessLogger_Rename.js';
import { AuditListReport } from '../webApplication/AuditListReport.js';
export class WebPageThrottledAuditRunner {
    //constructor(webApplication, url, reportFolder, logger, auditInstanceId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    constructor(configFileFullPath) {
        this.logger = new ProcessLogger();
        this.config = JSON.parse(fs.readFileSync(configFileFullPath, 'utf8'));
        const reportFolderFullPath = path.join(process.cwd(), this.config.ReportFolderRelativePath);
        //print working directory
        const webPage = new WebPageModel(this.config.WebPage.Url, this.config.WebPage.Name, this.config.WebPage.Description);
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
        const webPageAuditConfiguration = new WebPageThrottledAuditConfiguration(webPage, reportFolderFullPath, this.webApplication, throttlingSettings);
        this.engine = new WebPageThrottledAuditEngine(webPageAuditConfiguration, this.logger)
        this.auditListReport = new AuditListReport(this.webApplication, reportFolderFullPath, this.logger);
    }

    async run(useExternalThrottling = true) {
        let { summaryPath, chartReportPath } = await this.engine.run(useExternalThrottling);
        this.logger.logInfo(`Summary path is ${summaryPath}`);
        this.logger.logInfo(`chartReportPath path is ${chartReportPath}`);
        this.auditListReport.generate();
    };
}
