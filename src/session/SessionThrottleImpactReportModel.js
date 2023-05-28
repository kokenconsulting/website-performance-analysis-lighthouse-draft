
// app information class that consist of projectname, gitrepourl, gitbranchname
export class SessionThrottleImpactReportModel {
  constructor(appInfo, sessionId, networkSpeedList, cpuSlowDownMultiplierResultsList) {
    this.appInfo = appInfo;
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
  constructor(appInfo,sessionThrottleImpactReportModelList) {
    this.appInfo = appInfo;
    this.sessionThrottleImpactReportModelList = sessionThrottleImpactReportModelList;
  }

  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}