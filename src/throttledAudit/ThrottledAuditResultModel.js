import { BaseModel } from "../base/BaseModel.js";

export class ThrottledAuditResultModel extends BaseModel {
    constructor(webPage,webApplication, throttledAuditGroupId, initiatedBy, executionEnvironment, startDateTime, endDateTime, networkThrottle, cpuSlowDownMultiplier, loadTimeInteractive, loadTimeSpeedIndex) {
      super();
      this.webPage= webPage;
      this.webApplication = webApplication;
      this.throttledAuditGroupId = throttledAuditGroupId;
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