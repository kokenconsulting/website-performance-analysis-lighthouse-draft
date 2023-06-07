import { BaseModel } from '../../base/BaseModel.js';
import { WebApplicationModel } from '../../webApplication/WebApplicationModel.js';
import { WebPageModel } from '../../webPage/WebPageModel.js';

export class EnvironmentThrottleSettingChartDataModel extends BaseModel {
  constructor(
    private webPage: WebPageModel,
    private webApplication: WebApplicationModel,
    private cpuSlowDownMultiplierList: number[],
    private networkSpeedList: number[]
  ) {
    super();
  }
}