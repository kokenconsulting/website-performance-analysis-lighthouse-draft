import { BaseModel } from '../Base/BaseModel.js';

export class WebApplicationListReportModel extends BaseModel {
    private webApplicationList: string[];

    constructor(webApplicationList: string[]) {
        super();
        this.webApplicationList = webApplicationList;
    }

    public getWebApplicationList(): string[] {
        return this.webApplicationList;
    }
}