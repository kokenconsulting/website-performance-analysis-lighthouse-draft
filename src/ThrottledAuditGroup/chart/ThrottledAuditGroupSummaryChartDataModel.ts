import { BaseModel } from "../../Base_2/BaseModel.js";
import { WebApplicationModel } from "../../webApplication/WebApplicationModel.js";
import { WebPageModel } from "../../webPage/WebPageModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class ThrottledAuditGroupSummaryChartDataModel extends BaseModel {
    private webPage: WebPageModel;
    private webApplication: WebApplicationModel;
    private throttledAuditGroupId: string;
    private networkSpeedList: number[];
    private cpuSlowDownMultiplierResultsList: any;

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, throttledAuditGroupId: string, networkSpeedList: number[], cpuSlowDownMultiplierResultsList: any) {
        super();
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.throttledAuditGroupId = throttledAuditGroupId;
        this.networkSpeedList = networkSpeedList;
        this.cpuSlowDownMultiplierResultsList = cpuSlowDownMultiplierResultsList;
    }
}