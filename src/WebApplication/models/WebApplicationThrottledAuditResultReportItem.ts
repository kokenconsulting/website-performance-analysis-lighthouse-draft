export class WebApplicationThrottledAuditResultReportItem {
  constructor(
    public throttledAuditGroupId: string,
    public networkSpeedInKbps: number,
    public cpuSlowDownMultiplier: number,
    public loadTimeInteractiveInMilliSeconds: number,
    public loadTimeSpeedIndexInMilliseconds: number,
    public startDateTime: Date,
    public endDateTime: Date
  ) {}

  toJson(): any {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}