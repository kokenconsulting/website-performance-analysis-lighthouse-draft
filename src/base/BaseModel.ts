export class BaseModel {
  constructor() {}

  public toJson(): string {
    //return a json object consisting on non-function properties
    //return JSON.parse(JSON.stringify(this));
    return JSON.stringify(this);
  }
}