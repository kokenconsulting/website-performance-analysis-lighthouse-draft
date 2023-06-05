import { BaseModel } from '../../base/BaseModel';

export class WebPageEnvironmentAuditListReportModel extends BaseModel {
  constructor(private webPage: any, private webApplication: any, private auditResultList: string[]) {
    super();
  }
}