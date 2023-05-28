
import { BaseModel } from '../base/BaseModel.js';

export class AppInfo extends BaseModel {
  constructor(projectName, version, environment, gitRepoUrl, gitBranchName, initiatedBy) {
    super();
    this.projectName = projectName;
    this.version = version;
    this.environment = environment;
    this.gitRepoUrl = gitRepoUrl;
    this.gitBranchName = gitBranchName;
    this.initiatedBy = initiatedBy;
  }
}
