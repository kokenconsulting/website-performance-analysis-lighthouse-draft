export class ThrottledAuditGroupConfiguration {
    public webPage: any;
    public reportFolderFullPath: string;
    public webApplication: any;
    public throttlingSettings: any;

    constructor(webPage: any, reportFolderFullPath: string, webApplication: any, throttlingSettings: any) {
        this.webPage = webPage;
        this.reportFolderFullPath = reportFolderFullPath;
        this.webApplication = webApplication;
        this.throttlingSettings = throttlingSettings;
    }
}