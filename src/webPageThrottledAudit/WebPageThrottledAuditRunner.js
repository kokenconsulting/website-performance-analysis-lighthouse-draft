import * as fs from 'fs';
import { WebPageThrottledAuditConfiguration } from './WebPageThrottledAuditConfiguration.js';
import { ThrottlingSettings } from '../throttling/ThrottlingSettings.js';
import { WebApplication } from '../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../webPage/WebPageModel.js';
import { WebPageThrottledAuditEngine } from './WebPageThrottledAuditEngine.js';
import { ProcessLogger } from '../log/Processlogger.js';

export class WebPageThrottledAuditRunner {
    //constructor(webApplication, url, reportFolder, logger, auditInstanceId = null, cpuSlowdownMultiplierArray = null, networkSpeedArray = null) {
    constructor(configFileFullPath) {
        const logger = new ProcessLogger();
        const config = JSON.parse(fs.readFileSync(configFileFullPath, 'utf8'));
        //print working directory
        const webPage = new WebPageModel(config.WebPage.Url, config.WebPage.Name, config.WebPage.Description);
        const application = new WebApplication(
            config.Application.Name,
            config.Application.Version,
            config.Application.Description,
            config.Application.GitUrl,
            config.Application.GitBranch,
            config.Application.Environment
        );

        const throttlingSettings = new ThrottlingSettings(
            config.ThrottlingSettings.NetworkSpeeds,
            config.ThrottlingSettings.CPUSlowDownMultipliers
        );
        const webPageAuditConfiguration = new WebPageThrottledAuditConfiguration(webPage, config.ReportFolderFullPath, application, throttlingSettings);
        this.engine = new WebPageThrottledAuditEngine(webPageAuditConfiguration,logger)
    }

    async run(useExternalThrottling = true) {
        await this.engine.run(useExternalThrottling);
    };
}
