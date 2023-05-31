
// app information class that consist of projectname, gitrepourl, gitbranchname

import { BaseModel } from '../../base/BaseModel.js';
export class WebPageEnvironmentListReportModel extends  BaseModel {
  constructor(webPage,webApplication, environmentList) {
    super();
    this.webPage = webPage;
    this.webApplication = webApplication;
    this.environmentList = environmentList;
  }
}


