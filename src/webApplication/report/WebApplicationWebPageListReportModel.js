
// app information class that consist of projectname, gitrepourl, gitbranchname

import { BaseModel } from '../../base/BaseModel.js';
export class WebApplicationWebPageListReporttModel extends  BaseModel {
  constructor(webPage,webApplication, webPageList) {
    super();
    this.webPage = webPage;
    this.webApplication = webApplication;
    this.webPageList = webPageList;
  }
}


