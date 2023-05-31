import { BaseModel } from "../../base/BaseModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class WebPageThrottledAuditSummaryChartDataModel extends BaseModel {
  constructor(webPage,webApplication, auditInstanceId, networkSpeedList, cpuSlowDownMultiplierResultsList) {
    super();
    this.webPage = webPage;
    this.webApplication = webApplication;
    this.auditInstanceId = auditInstanceId;
    this.networkSpeedList = networkSpeedList;
    this.cpuSlowDownMultiplierResultsList = cpuSlowDownMultiplierResultsList;
  }
}

