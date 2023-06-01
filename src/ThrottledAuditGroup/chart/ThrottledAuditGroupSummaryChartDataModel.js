import { BaseModel } from "../../base/BaseModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class ThrottledAuditGroupSummaryChartDataModel extends BaseModel {
  constructor(webPage,webApplication, throttledAuditGroupId, networkSpeedList, cpuSlowDownMultiplierResultsList) {
    super();
    this.webPage = webPage;
    this.webApplication = webApplication;
    this.throttledAuditGroupId = throttledAuditGroupId;
    this.networkSpeedList = networkSpeedList;
    this.cpuSlowDownMultiplierResultsList = cpuSlowDownMultiplierResultsList;
  }
}

