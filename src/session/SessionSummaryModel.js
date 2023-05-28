
// app information class that consist of projectname, gitrepourl, gitbranchname

import { BaseModel } from '../base/BaseModel.js';
export class SessionSummaryModel extends  BaseModel {
  constructor(appInfo, analysisResultList) {
    super();
    this.appInfo = appInfo;
    this.analysisResultList = analysisResultList;
  }
}


