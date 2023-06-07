import { BaseModel } from '../../Base/BaseModel.js';
import { WebApplicationModel } from '../../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../WebPageModel.js';

export class WebPageEnvironmentListReportModel extends BaseModel {
  constructor(private webPage: WebPageModel, private webApplication: WebApplicationModel, private environmentList: string[]) {
    super();
  }
}