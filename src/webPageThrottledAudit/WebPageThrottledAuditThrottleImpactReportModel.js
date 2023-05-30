
// app information class that consist of projectname, gitrepourl, gitbranchname
export class WebPageThrottledAuditThrottleImpactReportModel {
  constructor(webApplication, auditInstanceId, networkSpeedList, cpuSlowDownMultiplierResultsList) {
    this.webApplication = webApplication;
    this.auditInstanceId = auditInstanceId;
    this.networkSpeedList = networkSpeedList;
    this.cpuSlowDownMultiplierResultsList = cpuSlowDownMultiplierResultsList;
  }

  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}

