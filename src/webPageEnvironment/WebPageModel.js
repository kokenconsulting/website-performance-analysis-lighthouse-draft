
// app information class that consist of projectname, gitrepourl, gitbranchname

import { BaseModel } from '../base/BaseModel.js';
export class WebPageModel extends BaseModel {
  constructor(url, id,displayName, environment,description) {
    super();
    this.url = url;
    this.id = id;
    this.environment = environment;
    this.displayName = displayName;
    this.description = description;
  }
}