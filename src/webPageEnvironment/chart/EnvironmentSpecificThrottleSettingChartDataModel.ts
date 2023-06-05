import { BaseModel } from '../../base/BaseModel';

export class EnvironmentSpecificThrottleSettingChartDataModel extends BaseModel {
  constructor(
    private webPage: any,
    private webApplication: any,
    private cpuSlowDownMultiplier: number,
    private networkSpeed: number,
    private labels: string[],
    private listOfDataSets: any[]
  ) {
    super();
  }
}