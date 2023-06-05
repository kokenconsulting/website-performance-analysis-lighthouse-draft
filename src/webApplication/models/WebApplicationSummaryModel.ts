import { ThrottledAuditGroupSummaryReportModel } from "../../ThrottledAuditGroup/reports/ThrottledAuditGroupSummaryReportModel";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class WebApplicationEnvironmentSummaryModel {
  public webApplication: any;
  public throttledAuditGroupSummaryList: ThrottledAuditGroupSummaryReportModel[];

  constructor(webApplication: any, throttledAuditGroupSummaryList: ThrottledAuditGroupSummaryReportModel[]) {
    this.webApplication = webApplication;
    this.throttledAuditGroupSummaryList = throttledAuditGroupSummaryList;
  }

  toJson(): any {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}