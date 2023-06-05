// import * as chromeLauncher from 'chrome-launcher';
// import lighthouse, { Config } from 'lighthouse';
// import { EngineBase } from '../base/EngineBase';
// import { LighthouseAuditReport } from './LighthouseAuditReport';
// import { ProcessLogger } from '../base/ProcessLogger_Rename';

// interface NetworkSpeed {
//   rttMs: number;
//   throughputKbps: number;
// }

// const maxWaitForFcp = 30000;
// const maxWaitForLoad = 60000;
// const formFactor = 'desktop';

// export class LighthouseAuditEngine extends EngineBase {
//   private webPage: any;
//   private networkSpeed: NetworkSpeed;
//   private cpuSlowdownMultiplier: number;
//   private externalNetworkSpeed: NetworkSpeed | null;
//   private report: LighthouseAuditReport;

//   constructor(
//     webPage: any,
//     webApplication: any,
//     reportFolder: string,
//     logger: ProcessLogger,
//     throttledAuditGroupId: string,
//     cpuSlowdownMultiplier: number,
//     networkSpeed: NetworkSpeed,
//     externalNetworkSpeed: NetworkSpeed | null = null
//   ) {
//     super(logger);
//     this.webPage = webPage;
//     this.networkSpeed = networkSpeed;
//     this.cpuSlowdownMultiplier = cpuSlowdownMultiplier;
//     this.externalNetworkSpeed = externalNetworkSpeed;
//     if (this.externalNetworkSpeed !== null) {
//       this.report = new LighthouseAuditReport(
//         webPage,
//         webApplication,
//         reportFolder,
//         this.logger,
//         throttledAuditGroupId,
//         cpuSlowdownMultiplier,
//         externalNetworkSpeed
//       );
//     } else {
//       this.report = new LighthouseAuditReport(
//         webPage,
//         webApplication,
//         reportFolder,
//         this.logger,
//         throttledAuditGroupId,
//         cpuSlowdownMultiplier,
//         networkSpeed
//       );
//     }
//   }

//   async run(): Promise<any> {
//     const chrome = await chromeLauncher.launch({
//       chromeFlags: ['--headless', '--ignore-certificate-errors'],
//     });

//     const lighthouseConfig: Config = {
//       extends: 'lighthouse:default',
//       settings: {
//         formFactor: formFactor,
//         maxWaitForFcp: maxWaitForFcp,
//         maxWaitForLoad: maxWaitForLoad,
//         screenEmulation: { mobile: false },
//         throttlingMethod: 'devtools',
//         throttling: {
//           cpuSlowdownMultiplier: this.cpuSlowdownMultiplier,
//           requestLatencyMs: this.networkSpeed.rttMs,
//           downloadThroughputKbps: this.networkSpeed.throughputKbps,
//           uploadThroughputKbps: this.networkSpeed.throughputKbps,
//         },
//       },
//     };
//     lighthouseConfig.settings.customSettings = {};
//     if (this.externalNetworkSpeed !== null) {
//       lighthouseConfig.settings.externalNetworkSpeed = this.externalNetworkSpeed;
//       lighthouseConfig.settings.customSettings.providedNetworkThrottling = this.externalNetworkSpeed;
//     } else {
//       lighthouseConfig.settings.customSettings.providedNetworkThrottling = this.networkSpeed;
//     }
//     lighthouseConfig.settings.customSettings.providedCPUSlowDownMultiplier = this.cpuSlowdownMultiplier;

//     const options = {
//       port: chrome.port,
//       onlyCategories: ['performance'],
//       output: 'json',
//       logLevel: 'info',
//       screenEmulation: {
//         mobile: false,
//         width: 800,
//         height: 600,
//         deviceScaleFactor: 1,
//         disabled: true,
//       },
//     };

//     const lighthouseResults = await lighthouse(this.webPage.url, options, lighthouseConfig);
//     await chrome.kill();

//     const report = lighthouseResults.report as string;
//     const jsonReport = JSON.parse(report);
//     this.report.saveReport(jsonReport);
//     return jsonReport;
//   }
// }