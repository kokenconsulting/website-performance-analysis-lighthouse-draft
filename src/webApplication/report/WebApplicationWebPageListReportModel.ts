import { BaseModel } from '../../base/BaseModel';

export class WebApplicationWebPageListReporttModel extends BaseModel {
  constructor(private webPage: any, private webApplication: any, private webPageList: string[]) {
    super();
  }
}