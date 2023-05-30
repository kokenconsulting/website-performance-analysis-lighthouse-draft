
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

// app information class that consist of projectname, gitrepourl, gitbranchname
export class ApplicationThrottleImpactReportModel {
  constructor(webApplication,WebPageThrottledAuditThrottleImpactReportModelList) {
    this.webApplication = webApplication;
    this.WebPageThrottledAuditThrottleImpactReportModelList = WebPageThrottledAuditThrottleImpactReportModelList;
  }

  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}