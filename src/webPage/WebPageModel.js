
// app information class that consist of projectname, gitrepourl, gitbranchname

import { BaseModel } from '../base/BaseModel.js';
export class WebPageModel extends  BaseModel {
  constructor(url,displayName,description ) {
    super();
    this.url = url;
    this.displayName = displayName;
    this.description = description;
  }
}


