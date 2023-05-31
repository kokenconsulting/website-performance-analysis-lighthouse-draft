import { BaseModel } from "../../base/BaseModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class EnvironmentAuditResultsChartDataModel extends BaseModel {
  constructor(webPage,webApplication, labels, listOfDataSets) {
    super();
    this.webPage = webPage;
    this.webApplication = webApplication;
    this.labels = labels;
    this.listOfDataSets = listOfDataSets;
  }
}

