import { BaseModel } from '../../base/BaseModel.js';
import { WebPageModel } from '../../webPage/WebPageModel.js';
import { WebApplicationModel } from '../WebApplicationModel.js';

export class WebApplicationWebPageListReporttModel extends BaseModel {
  constructor(private webPage: WebPageModel, private webApplication: WebApplicationModel, private webPageList: string[]) {
    super();
  }
}