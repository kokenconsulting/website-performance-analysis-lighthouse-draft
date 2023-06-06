import { BaseModel } from '../base/BaseModel.js';

export class WebApplication extends BaseModel {
  constructor(
    public id: string,
    public name: string,
    public version: string,
    public environment: string,
    public gitRepoUrl: string,
    public gitBranchName: string,
    public initiatedBy: string
  ) {
    super();
  }
}