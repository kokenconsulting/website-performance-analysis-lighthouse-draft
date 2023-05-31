
// app information class that consist of projectname, gitrepourl, gitbranchname
export class WebApplicationThrottledAuditResultReportItem {
  constructor(auditInstanceId, networkSpeedInKbps, cpuSlowDownMultiplier, loadTimeInteractiveInMilliSeconds, loadTimeSpeedIndexInMilliseconds, startTime, endTime) {
    this.auditInstanceId = auditInstanceId;
    this.networkSpeedInKbps = networkSpeedInKbps;
    this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
    this.loadTimeInteractiveInMilliSeconds = loadTimeInteractiveInMilliSeconds;
    this.loadTimeSpeedIndexInMilliseconds = loadTimeSpeedIndexInMilliseconds;
    this.startDateTime = startTime;
    this.endDateTime = endTime;

  }

  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}

