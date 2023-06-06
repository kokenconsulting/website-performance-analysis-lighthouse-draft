// import * as fs from 'fs';
// import { BaseReport } from '../base/BaseReport.js';
// import { WebApplicationThrottledAuditResultReportItem } from './models/WebApplicationThrottledAuditResultReportItem';

// export class WebApplicationThrottledAuditResultsReport extends BaseReport {
//     private flatData: WebApplicationThrottledAuditResultReportItem[];
//     private reportObject: any;
//     private allResultsFilePath: string;
//     private allKeysFilePath: string;
//     private allKeys: string[];

//     constructor(webPage: WebPageModel, webApplication: WebApplicationModel, reportFolder: string, logger: any) {
//         super(webPage, webApplication, reportFolder, logger);
//         this.flatData = [];
//         this.reportObject = {};
//         this.allResultsFilePath = this.getAppReportAllResultsFilePath();
//         this.allKeysFilePath = this.getApplicationChartDataAllKeysFilePath();
//         this.allKeys = [];
//     }

//     public generate(): void {
//         this.logger.logInfo(`Preparing throttledAuditGroup list for app ${this.webApplication.name}`);
//         this.prepareAuditDataForApplication();
//         this.createChartData();
//         this.createSpecificReportFiles();
//         this.saveAllKeysReport();
//     }

//     private addToReportItemList(throttledAuditGroupId: string, auditSummaryObject: any): void {
//         for (const auditResult of auditSummaryObject.auditResultList) {
//             const item = new WebApplicationThrottledAuditResultReportItem(
//                 throttledAuditGroupId,
//                 auditResult.networkThrottle,
//                 auditResult.cpuSlowDownMultiplier,
//                 auditResult.loadTimeInteractive,
//                 auditResult.loadTimeSpeedIndex,
//                 auditResult.startDateTime,
//                 auditResult.endDateTime
//             );
//             this.flatData.push(item);
//         }
//         this.flatData.sort(function (a, b) {
//             return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
//         });
//     }

//     private createSpecificReportFiles(): void {
//         //loop this.reportObject with key,value pair
//         for (const [key, value] of Object.entries(this.reportObject)) {
//             this.saveSpecificKeyReport(key, value);
//         }
//     }

//     private saveSpecificKeyReport(key: string, value: any): void {
//         const specificFilePath = this.getApplicationChartDataSpecificFilePath(key);
//         if (fs.existsSync(specificFilePath) === true) {
//             fs.unlinkSync(specificFilePath);
//         }
//         fs.writeFileSync(specificFilePath, JSON.stringify(value));
//     }

//     private createChartData(): void {
//         for (const auditResult of this.flatData) {
//             const formattedKey = `${auditResult.networkSpeedInKbps}_${auditResult.cpuSlowDownMultiplier}`;
//             //if formattedKey does not exist in reportObject, add an array for the formattedKey
//             if (!this.reportObject[formattedKey]) {
//                 this.reportObject[formattedKey] = {
//                     interactive: [],
//                     speedIndex: [],
//                     throttledAuditGroupId: []
//                 };
//             }
//             this.reportObject[formattedKey].interactive.push(auditResult.loadTimeInteractiveInMilliSeconds);
//             this.reportObject[formattedKey].speedIndex.push(auditResult.loadTimeSpeedIndexInMilliseconds);
//             this.reportObject[formattedKey].throttledAuditGroupId.push({
//                 throttledAuditGroupId: auditResult.throttledAuditGroupId,
//                 startDateTime: auditResult.startDateTime,
//                 endDateTime: auditResult.endDateTime
//             });
//             //check if formatted key exists. If not, push formattedKey to allKeys
//             if (this.allKeys.includes(formattedKey) === false) {
//                 this.allKeys.push(formattedKey);
//             }
//         }
//     }

//     private prepareAuditDataForApplication(): void {
//         const auditListFolderPath = this.getWebPageAuditFolderPath();
//         this.logger.logInfo(`appFolderPath: ${auditListFolderPath}`);
//         for (const auditFolder of fs.readdirSync(auditListFolderPath)) {
//             if (!auditFolder.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
//                 continue;
//             }
//             const throttledAuditGroupId = auditFolder;
//             this.logger.logInfo(`throttledAuditGroupId: ${throttledAuditGroupId}`);
//             //if folder is empty, then delete folder and continue
//             if (fs.readdirSync(`${auditListFolderPath}/${auditFolder}`).length === 0) {
//                 fs.rmdirSync(`${auditListFolderPath}/${auditFolder}`);
//                 continue;
//             }
//             const auditSummaryFilePath = this.getThrottledAuditGroupSummaryReportFilePath(throttledAuditGroupId);
//             const auditSummaryObject = JSON.parse(fs.readFileSync(auditSummaryFilePath, 'utf8'));
//             this.addToReportItemList(throttledAuditGroupId, auditSummaryObject);
//         }
//     }

//     private saveReport(): void {
//         //delete this.allResultsFilePath if exists
//         if (this.checkIfReportFileExists() === true) {
//             fs.unlinkSync(this.allResultsFilePath);
//         }

//         fs.writeFileSync(this.allResultsFilePath, JSON.stringify(this.reportObject), 'utf8');
//     }

//     private saveAllKeysReport(): void {
//         //delete this.allResultsFilePath if exists
//         if (this.checkIfAllKeysReportFileExists() === true) {
//             fs.unlinkSync(this.allKeysFilePath);
//         }

//         fs.writeFileSync(this.allKeysFilePath, JSON.stringify(this.allKeys), 'utf8');
//     }

//     public getReport(): any {
//         //read file
//         return JSON.parse(fs.readFileSync(this.reportObject, 'utf8'));
//     }

//     public checkIfReportFileExists(): boolean {
//         return fs.existsSync(this.allResultsFilePath);
//     }

//     public checkIfAllKeysReportFileExists(): boolean {
//         return fs.existsSync(this.allKeysFilePath);
//     }
// }