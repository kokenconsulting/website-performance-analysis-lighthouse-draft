
// app information class that consist of projectname, gitrepourl, gitbranchname
export class ApplicationSummaryModel {
  constructor(webApplication, sessionSummaryList) {
    this.webApplication = webApplication;
    this.sessionSummaryList = sessionSummaryList;
  }
  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}


