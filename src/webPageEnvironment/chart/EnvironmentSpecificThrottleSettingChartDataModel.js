import { BaseModel } from "../../base/BaseModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class EnvironmentSpecificThrottleSettingChartDataModel extends BaseModel {
  constructor(webPage,webApplication, cpuSlowDownMultiplier, networkSpeed, labels, listOfDataSets) {
    super();
    this.webPage = webPage;
    this.webApplication = webApplication;
    this.cpuSlowDownMultiplier = cpuSlowDownMultiplier;
    this.networkSpeed = networkSpeed;
    this.labels = labels;
    this.listOfDataSets = listOfDataSets;
  }
}

