export class SessionConfiguration {
  constructor(url,reportFolderRelativePath,application, throttlingSettings) {
    this.url = url;
    this.reportFolderRelativePath = reportFolderRelativePath;
    this.webApplication = application;
    this.throttlingSettings = throttlingSettings;
  }
}