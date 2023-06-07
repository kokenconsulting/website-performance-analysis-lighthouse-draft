import { ThrottledAuditGroupSummaryReportModel } from "../../ThrottledAuditGroup/reports/ThrottledAuditGroupSummaryReportModel.js";
import { WebApplicationModel } from "../WebApplicationModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class WebApplicationEnvironmentSummaryModel {
  public webApplication: WebApplicationModel;
  public throttledAuditGroupSummaryList: ThrottledAuditGroupSummaryReportModel[];

  constructor(webApplication: WebApplicationModel, throttledAuditGroupSummaryList: ThrottledAuditGroupSummaryReportModel[]) {
    this.webApplication = webApplication;
    this.throttledAuditGroupSummaryList = throttledAuditGroupSummaryList;
  }

  toJson(): any {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}