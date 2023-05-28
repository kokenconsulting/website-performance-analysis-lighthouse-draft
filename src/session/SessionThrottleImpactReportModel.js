
// app information class that consist of projectname, gitrepourl, gitbranchname
export class SessionThrottleImpactReportModel {
  constructor(webApplication, sessionId, networkSpeedList, cpuSlowDownMultiplierResultsList) {
    this.webApplication = webApplication;
    this.sessionId = sessionId;
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
  constructor(webApplication,sessionThrottleImpactReportModelList) {
    this.webApplication = webApplication;
    this.sessionThrottleImpactReportModelList = sessionThrottleImpactReportModelList;
  }

  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}