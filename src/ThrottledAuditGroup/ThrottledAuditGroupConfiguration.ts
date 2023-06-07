import { WebApplicationModel } from "../WebApplication/WebApplicationModel.js";
import { WebPageModel } from "../WebPage/WebPageModel.js";

export class ThrottledAuditGroupConfiguration {
    public webPage: WebPageModel;
    public reportFolderFullPath: string;
    public webApplication: WebApplicationModel;
    public throttlingSettings: any;

    constructor(webPage: WebPageModel, reportFolderFullPath: string, webApplication: WebApplicationModel, throttlingSettings: any) {
        this.webPage = webPage;
        this.reportFolderFullPath = reportFolderFullPath;
        this.webApplication = webApplication;
        this.throttlingSettings = throttlingSettings;
    }
}