import { BaseModel } from '../../Base/BaseModel.js';
import { WebApplicationModel } from '../../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../../webPage/WebPageModel.js';

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