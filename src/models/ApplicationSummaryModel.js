
// app information class that consist of projectname, gitrepourl, gitbranchname
export class ApplicationSummaryModel {
  constructor(appInfo, sessionSummaryList) {
    this.appInfo = appInfo;
    this.sessionSummaryList = sessionSummaryList;
  }
  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}


