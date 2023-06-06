import { BaseModel } from "../../base/BaseModel.js";
import { WebApplication } from "../../index.js";
import { WebApplicationModel } from "../../webApplication/WebApplicationModel.js";
import { WebPageModel } from "../../webPage/WebPageModel.js";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class ThrottledAuditGroupSummaryReportModel extends BaseModel {
    protected webPage: WebPageModel;
    protected webApplication: WebApplication;
    public auditResultList: any[];

    constructor(webPage: WebPageModel, webApplication: WebApplicationModel, auditResultList: any[]) {
        super();
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.auditResultList = auditResultList;
    }
}