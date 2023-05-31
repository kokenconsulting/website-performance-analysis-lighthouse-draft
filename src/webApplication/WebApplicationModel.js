
import { BaseModel } from '../base/BaseModel.js';

export class WebApplication extends BaseModel {
  constructor(id,name, version, environment, gitRepoUrl, gitBranchName, initiatedBy) {
    super();
    this.id = id;
    this.name = name;
    this.version = version;
   
    this.gitRepoUrl = gitRepoUrl;
    this.gitBranchName = gitBranchName;
    this.initiatedBy = initiatedBy;
  }
}

// export class Application {
//   constructor(name, version, description, gitUrl, gitBranch, environment) {
//     this.name = name;
//     this.version = version;
//     this.description = description;
//     this.gitUrl = gitUrl;
//     this.gitBranch = gitBranch;
//     this.environment = environment;
//   }
// }
