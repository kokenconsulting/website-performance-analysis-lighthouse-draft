import { BaseModel } from "../../base/BaseModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class ThrottledAuditGroupSummaryChartDataModel extends BaseModel {
    private webPage: any;
    private webApplication: any;
    private throttledAuditGroupId: string;
    private networkSpeedList: number[];
    private cpuSlowDownMultiplierResultsList: any;

    constructor(webPage: any, webApplication: any, throttledAuditGroupId: string, networkSpeedList: number[], cpuSlowDownMultiplierResultsList: any) {
        super();
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.networkSpeedList = networkSpeedList;
        this.cpuSlowDownMultiplierResultsList = cpuSlowDownMultiplierResultsList;
    }
}