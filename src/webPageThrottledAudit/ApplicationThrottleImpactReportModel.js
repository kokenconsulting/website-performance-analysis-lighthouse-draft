// app information class that consist of projectname, gitrepourl, gitbranchname

export class ApplicationThrottleImpactReportModel {
  constructor(webApplication, WebPageThrottledAuditThrottleImpactReportModelList) {
    this.webApplication = webApplication;
    this.WebPageThrottledAuditThrottleImpactReportModelList = WebPageThrottledAuditThrottleImpactReportModelList;
  }

  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}
