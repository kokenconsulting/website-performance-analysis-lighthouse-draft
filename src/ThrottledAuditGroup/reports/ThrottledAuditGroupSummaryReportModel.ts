import { BaseModel } from "../../base/BaseModel.js";
import { WebApplication } from "../../index.js";
import { WebPageModel } from "../../webPage/WebPageModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class ThrottledAuditGroupSummaryReportModel extends BaseModel {
    protected webPage: WebPageModel;
    protected webApplication: WebApplication;
    public auditResultList: any[];

    constructor(webPage: any, webApplication: any, auditResultList: any[]) {
        super();
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.auditResultList = auditResultList;
    }
}