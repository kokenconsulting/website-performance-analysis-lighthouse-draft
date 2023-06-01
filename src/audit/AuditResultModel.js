import { BaseModel } from "../base/BaseModel.js";

export class AuditResultModel extends BaseModel {
    constructor(webPage,webApplication, auditGroupId, initiatedBy, executionEnvironment, startDateTime, endDateTime, networkThrottle, cpuSlowDownMultiplier, loadTimeInteractive, loadTimeSpeedIndex) {
      super();
      this.webPage= webPage;
      this.webApplication = webApplication;
      this.auditGroupId = auditGroupId;
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