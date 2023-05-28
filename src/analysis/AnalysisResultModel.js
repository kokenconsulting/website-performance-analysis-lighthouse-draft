export class AnalysisResultModel {
    constructor(webApplication, sessionId, initiatedBy, executionEnvironment, startDateTime, endDateTime, networkThrottle, cpuSlowDownMultiplier, loadTimeInteractive, loadTimeSpeedIndex) {
      this.webApplication = webApplication;
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