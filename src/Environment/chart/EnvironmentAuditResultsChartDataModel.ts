import { BaseModel } from '../../Base_2/BaseModel.js';

export class EnvironmentAuditResultsChartDataModel extends BaseModel {
  constructor(
    private webPage: any,
    private webApplication: any,
    private labels: string[],
    private listOfDataSets: any[]
  ) {
    super();
  }
}