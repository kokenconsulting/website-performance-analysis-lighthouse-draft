import { BaseModel } from "../Base_2/BaseModel.js";
import { WebApplicationModel } from "../webApplication/WebApplicationModel.js";
import { WebPageModel } from "../webPage/WebPageModel.js";

export class ThrottledAuditResultModel extends BaseModel {
    private webPage: WebPageModel;
    private webApplication: WebApplicationModel;
    private throttledAuditGroupId: string;
    private initiatedBy: string;
    private executionEnvironment: string;
    private startDateTime: Date;
    private endDateTime: Date;
    private networkThrottle: any;
    private cpuSlowDownMultiplier: number;
    private loadTimeInteractive: number;
    private loadTimeSpeedIndex: number;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, throttledAuditGroupId: string, initiatedBy: string, executionEnvironment: string, startDateTime: Date, endDateTime: Date, networkThrottle: any, cpuSlowDownMultiplier: number, loadTimeInteractive: number, loadTimeSpeedIndex: number) {
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