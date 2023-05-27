
// app information class that consist of projectname, gitrepourl, gitbranchname
export class SessionSummaryModel {
  constructor(appInfo, analysisResultList) {
    this.appInfo = appInfo;
    this.analysisResultList = analysisResultList;
  }
  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}


