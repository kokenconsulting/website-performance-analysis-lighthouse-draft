import { BaseModel } from "../base/BaseModel";

export class ThrottledAuditResultModel extends BaseModel {
    private webPage: any;
    private webApplication: any;
    private throttledAuditGroupId: string;
    private initiatedBy: string;
    private executionEnvironment: string;
    private startDateTime: Date;
    private endDateTime: Date;
    private networkThrottle: any;
    private cpuSlowDownMultiplier: number;
    private loadTimeInteractive: number;
    private loadTimeSpeedIndex: number;

    constructor(webPage: any, webApplication: any, throttledAuditGroupId: string, initiatedBy: string, executionEnvironment: string, startDateTime: Date, endDateTime: Date, networkThrottle: any, cpuSlowDownMultiplier: number, loadTimeInteractive: number, loadTimeSpeedIndex: number) {
        super();
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.initiatedBy = initiatedBy;
        this.executionEnvironment = executionEnvironment;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.networkThrottle = networkThrottle;
        this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
        this.loadTimeInteractive = loadTimeInteractive;
        this.loadTimeSpeedIndex = loadTimeSpeedIndex;
    }
}