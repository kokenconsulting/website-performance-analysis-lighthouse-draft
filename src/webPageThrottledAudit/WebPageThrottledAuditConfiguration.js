export class WebPageThrottledAuditConfiguration {
  constructor(webPage,reportFolderFullPath,application, throttlingSettings) {
    this.webPage = webPage;
    this.reportFolderFullPath = reportFolderFullPath;
    this.webApplication = application;
    this.throttlingSettings = throttlingSettings;
  }
}