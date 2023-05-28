import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { BaseEngine } from '../base/BaseEngine.js';
const maxWaitForFcp = 1000000
const maxWaitForLoad = 2000000
const formFactor = "desktop"

export class LighthouseEngine extends BaseEngine {
    constructor(logger) {
        super(logger)
    }

    async runLighthouse(url, networkSpeed, cpuSlowdownMultiplier, externalNetworkSpeed = null) {
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
                    cpuSlowdownMultiplier: cpuSlowdownMultiplier,
                    requestLatencyMs: networkSpeed.rttMs,
                    downloadThroughputKbps: networkSpeed.throughputKbps,
                    uploadThroughputKbps: networkSpeed.throughputKbps,
                }
            }
        };
        lighthouseConfig.settings.customSettings = {};
        if (externalNetworkSpeed != null) {
            lighthouseConfig.settings.externalNetworkSpeed = externalNetworkSpeed;
        }
        lighthouseConfig.settings.customSettings.providedNetworkThrottling = networkSpeed;
        lighthouseConfig.settings.customSettings.providedCPUSlowDownMultiplier = cpuSlowdownMultiplier;


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

        const runnerResult = await lighthouse(url, options, lighthouseConfig);
        await chrome.kill();

        const report = runnerResult.report;
        const jsonReport = JSON.parse(report);
        return jsonReport;
    }
}