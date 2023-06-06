import { BaseModel } from '../../base/BaseModel.js';

export class EnvironmentThrottleSettingChartDataModel extends BaseModel {
  constructor(
    private webPage: any,
    private webApplication: any,
    private cpuSlowDownMultiplierList: number[],
    private networkSpeedList: number[]
  ) {
    super();
  }
}