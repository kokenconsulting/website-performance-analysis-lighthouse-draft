// BEGIN: abcde12345
export class BaseModel {
  constructor() {}

  toJson() {
    //return a json object consisting on non-function properties
    return JSON.parse(JSON.stringify(this));
  }
}
// END: abcde12345
