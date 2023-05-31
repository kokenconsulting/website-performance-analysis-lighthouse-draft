import { BaseModel } from "../../base/BaseModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class EnvironmentThrottleSettingChartDataModel extends BaseModel {
  constructor(webPage,webApplication, cpuSlowDownMultiplierList, networkSpeedList) {
    super();
    this.webPage = webPage;
    this.webApplication = webApplication;
    this.cpuSlowDownMultiplierList = cpuSlowDownMultiplierList;
    this.networkSpeedList = networkSpeedList;
  }
}

