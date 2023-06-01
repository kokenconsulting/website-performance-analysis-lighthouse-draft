import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { EngineBase } from '../base/EngineBase.js';
import {LighthouseAuditReport} from './LighthouseAuditReport.js';
const maxWaitForFcp = 1000000
const maxWaitForLoad = 2000000
const formFactor = "desktop"

export class LighthouseAuditEngine extends EngineBase {
    constructor(webPage,webApplication, reportFolder, logger,throttledAuditGroupId, cpuSlowdownMultiplier,networkSpeed,externalNetworkSpeed=null) {
        super(logger)
        this.webPage = webPage;
        this.networkSpeed =networkSpeed;
        this.cpuSlowdownMultiplier =cpuSlowdownMultiplier;
        this.externalNetworkSpeed = externalNetworkSpeed;
        if(this.externalNetworkSpeed != null){
            this.report = new LighthouseAuditReport(webPage,webApplication, reportFolder,this.logger,throttledAuditGroupId,cpuSlowdownMultiplier,externalNetworkSpeed);
        }else{
            this.report = new LighthouseAuditReport(webPage,webApplication, reportFolder,this.logger,throttledAuditGroupId,cpuSlowdownMultiplier,networkSpeed);
        }
        
    }
    
    async run() {
        const chrome = await chromeLauncher.launch({
            chromeFlags: ['--headless', '--ignore-certificate-errors']
        });

        const lighthouseConfig = {
            extends: 'lighthouse:default',
            settings: {
                formFactor: formFactor,
                maxWaitForFcp: maxWaitForFcp,
                maxWaitForLoad: maxWaitForLoad,
                screenEmulation: { mobile: false },
                throttlingMethod: "devtools",
                throttling: {
                    cpuSlowdownMultiplier: this.cpuSlowdownMultiplier,
                    requestLatencyMs: this.networkSpeed.rttMs,
                    downloadThroughputKbps: this.networkSpeed.throughputKbps,
                    uploadThroughputKbps: this.networkSpeed.throughputKbps,
                }
            }
        };
        lighthouseConfig.settings.customSettings = {};
        if (this.externalNetworkSpeed != null) {
            lighthouseConfig.settings.externalNetworkSpeed = this.externalNetworkSpeed;
            lighthouseConfig.settings.customSettings.providedNetworkThrottling = this.externalNetworkSpeed;
        } else {
            lighthouseConfig.settings.customSettings.providedNetworkThrottling = this.networkSpeed;

        }
        lighthouseConfig.settings.customSettings.providedCPUSlowDownMultiplier = this.cpuSlowdownMultiplier;


        const options = {
            port: chrome.port,
            onlyCategories: ['performance'],
            output: 'json',
            logLevel: 'info',
            screenEmulation: {
                mobile: false,
                width: 800,
                height: 600,
                deviceScaleFactor: 1,
                disabled: true,
            },
        };

        const lighthouseResults = await lighthouse(this.webPage.url, options, lighthouseConfig);
        await chrome.kill();

        const report = lighthouseResults.report;
        const jsonReport = JSON.parse(report);
        this.report.saveReport(jsonReport);
        return jsonReport;
    }
}