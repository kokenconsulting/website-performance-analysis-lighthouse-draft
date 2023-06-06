import { BaseModel } from '../../base/BaseModel.js';

export class WebPageEnvironmentListReportModel extends BaseModel {
  constructor(private webPage: any, private webApplication: any, private environmentList: string[]) {
    super();
  }
}