import { BaseModel } from '../Base/BaseModel.js';

export class WebPageModel extends BaseModel {
  constructor(
    public url: string,
    public id: string,
    public displayName: string,
    public environment: string,
    public description: string
  ) {
    super();
  }
}