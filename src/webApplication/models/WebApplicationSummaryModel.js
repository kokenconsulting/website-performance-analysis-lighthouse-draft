
// app information class that consist of projectname, gitrepourl, gitbranchname
export class WebApplicationEnvironmentSummaryModel {
  constructor(webApplication, throttledAuditGroupSummaryList) {
    this.webApplication = webApplication;
    this.throttledAuditGroupSummaryList = throttledAuditGroupSummaryList;
  }
  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}
