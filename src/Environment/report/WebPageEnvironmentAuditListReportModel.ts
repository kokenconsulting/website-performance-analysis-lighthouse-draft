import { BaseModel } from '../../Base/BaseModel.js';
import { WebApplicationModel } from '../../WebApplication/WebApplicationModel.js';
import { WebPageModel } from '../../WebPage/WebPageModel.js';

export class WebPageEnvironmentAuditListReportModel extends BaseModel {
  constructor(private webPage: WebPageModel, private webApplication: WebApplicationModel, private auditResultList: string[]) {
    super();
  }
}