import { BaseModel } from "../../base/BaseModel";

// app information class that consist of projectname, gitrepourl, gitbranchname
export class ThrottledAuditGroupSummaryReportModel extends BaseModel {
    protected webPage: any;
    protected webApplication: any;
    public auditResultList: any[];

    constructor(webPage: any, webApplication: any, auditResultList: any[]) {
        super();
        this.webPage = webPage;
        this.webApplication = webApplication;
        this.auditResultList = auditResultList;
    }
}