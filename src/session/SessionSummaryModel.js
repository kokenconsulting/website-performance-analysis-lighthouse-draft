
// app information class that consist of projectname, gitrepourl, gitbranchname

import { BaseModel } from '../base/BaseModel.js';
export class SessionSummaryModel extends  BaseModel {
  constructor(webApplication, analysisResultList) {
    super();
    this.webApplication = webApplication;
    this.analysisResultList = analysisResultList;
  }
}


