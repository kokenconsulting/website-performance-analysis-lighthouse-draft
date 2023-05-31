
// app information class that consist of projectname, gitrepourl, gitbranchname

import { BaseModel } from '../base/BaseModel.js';
export class WebApplicationListReportModel extends  BaseModel {
  constructor(webApplicationList) {
    super();
    this.webApplicationList = webApplicationList;
  }
}


