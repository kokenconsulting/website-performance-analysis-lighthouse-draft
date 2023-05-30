export class AuditResultModel {
    constructor(webApplication, auditInstanceId, initiatedBy, executionEnvironment, startDateTime, endDateTime, networkThrottle, cpuSlowDownMultiplier, loadTimeInteractive, loadTimeSpeedIndex) {
      this.webApplication = webApplication;
      this.auditInstanceId = auditInstanceId;
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