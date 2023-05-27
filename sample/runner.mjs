import {
    AppInfo,
    ProcessLogger,
    SessionEngine,
    SessionListReport
  }
  from '../src/index.js';

const appInfo = new AppInfo('sample', '1.0.0',"dev","rep","main");
var sessionEngine = new SessionEngine(appInfo, 'https://www.google.com', 'reports', new ProcessLogger());
sessionEngine.runWithExternalThrottling();
var sessionListReport = new SessionListReport(appInfo, 'reports');
sessionListReport.generate();
