
// app information class that consist of projectname, gitrepourl, gitbranchname

import { BaseModel } from '../../base/BaseModel.js';
export class WebPageThrottledAuditSummaryReportModel extends  BaseModel {
  constructor(webPage,webApplication, auditResultList) {
    super();
    this.webPage = webPage;
    this.webApplication = webApplication;
    this.auditResultList = auditResultList;
  }
}


