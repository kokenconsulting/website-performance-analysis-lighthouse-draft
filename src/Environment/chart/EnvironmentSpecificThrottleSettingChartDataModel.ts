import { BaseModel } from '../../Base/BaseModel.js';
import { WebApplicationModel } from '../../WebApplication/WebApplicationModel.js';
import { WebPageModel } from '../../WebPage/WebPageModel.js';

export class EnvironmentSpecificThrottleSettingChartDataModel extends BaseModel {
  constructor(
    private webPage: WebPageModel,
    private webApplication: WebApplicationModel,
    private cpuSlowDownMultiplier: number,
    private networkSpeed: number,
    private labels: string[],
    private listOfDataSets: any[]
  ) {
    super();
  }
}