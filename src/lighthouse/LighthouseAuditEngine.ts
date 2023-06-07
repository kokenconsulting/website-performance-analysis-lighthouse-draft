import * as chromeLauncher from 'chrome-launcher';
import lighthouse, { Config, Flags, SharedFlagsSettings } from 'lighthouse';
import { EngineBase } from '../base/EngineBase.js';
import { LighthouseAuditReport } from './LighthouseAuditReport.js';
import { ProcessLogger } from '../log/ProcessLogger.js';
import { WebPageModel } from '../webPage/WebPageModel.js';
import { WebApplicationModel } from '../webApplication/WebApplicationModel.js';
interface NetworkSpeed {
  rttMs: number;
  throughputKbps: number;
}

const maxWaitForFcp = 30000;
const maxWaitForLoad = 60000;
const formFactor = 'desktop';
interface CustomFlagsSettings extends SharedFlagsSettings {
  customSettings?: Record<string, unknown>;
}
export class LighthouseAuditEngine extends EngineBase {
  private webPage: WebPageModel;
  private networkSpeed: NetworkSpeed;
  private cpuSlowdownMultiplier: number;
  private externalNetworkSpeed: NetworkSpeed | null;
  private report: LighthouseAuditReport;

  constructor(
    webPage: WebPageModel,
    webApplication: WebApplicationModel,
    reportFolder: string,
    logger: ProcessLogger,
    throttledAuditGroupId: string,
    cpuSlowdownMultiplier: number,
    networkSpeed: NetworkSpeed,
    externalNetworkSpeed: NetworkSpeed | null = null
  ) {
    super(logger);
    this.webPage = webPage;
    this.networkSpeed = networkSpeed;
    this.cpuSlowdownMultiplier = cpuSlowdownMultiplier;
    this.externalNetworkSpeed = externalNetworkSpeed;
    if (this.externalNetworkSpeed !== null) {
      this.report = new LighthouseAuditReport(
        webPage,
        webApplication,
        reportFolder,
        this.logger,
        throttledAuditGroupId,
        cpuSlowdownMultiplier,
        externalNetworkSpeed
      );
    } else {
      this.report = new LighthouseAuditReport(
        webPage,
        webApplication,
        reportFolder,
        this.logger,
        throttledAuditGroupId,
        cpuSlowdownMultiplier,
        networkSpeed
      );
    }
  }

  async run(): Promise<any> {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--ignore-certificate-errors'],
    });

    const lighthouseConfig: Config = {
      extends: 'lighthouse:default',
      settings: {
        customSettings: {
          providedNetworkThrottling: this.externalNetworkSpeed,
          externalNetworkSpeed: this.externalNetworkSpeed
        },
        formFactor: formFactor,
        maxWaitForFcp: maxWaitForFcp,
        maxWaitForLoad: maxWaitForLoad,
        screenEmulation: { mobile: false },
        throttlingMethod: 'devtools',
        throttling: {
          cpuSlowdownMultiplier: this.cpuSlowdownMultiplier,
          requestLatencyMs: this.networkSpeed.rttMs,
          downloadThroughputKbps: this.networkSpeed.throughputKbps,
          uploadThroughputKbps: this.networkSpeed.throughputKbps,
        },
      } as CustomFlagsSettings,
    };
    //lighthouseConfig.settings.customSettings = {};
    if (!this.externalNetworkSpeed && lighthouseConfig.settings) {
      (lighthouseConfig.settings as CustomFlagsSettings).customSettings = {
        providedNetworkThrottling: this.networkSpeed,
      };
    }

    const options: Flags = {
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

    const report = lighthouseResults?.report as string;
    const jsonReport = JSON.parse(report);
    this.report.saveReport(jsonReport);
    return jsonReport;
  }
}