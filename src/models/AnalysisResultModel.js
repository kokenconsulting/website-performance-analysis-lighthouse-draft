export class AnalysisResultModel {
    constructor(appInfo, sessionId, initiatedBy, executionEnvironment, startDateTime, endDateTime, networkThrottle, cpuSlowDownMultiplier, loadTimeInteractive, loadTimeSpeedIndex) {
      this.appInfo = appInfo;
      this.sessionId = sessionId;
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