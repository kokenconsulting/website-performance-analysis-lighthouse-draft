import {
    AppInfo,
    ProcessLogger,
    SessionEngine,
    SessionListReport
  }
  from '../src/index.js';

const appInfo = new AppInfo('sample', '1.0.0',"dev","rep","main");
const logger = new ProcessLogger();
var sessionEngine = new SessionEngine(appInfo, 'https://www.google.com', 'reports',logger );
//await sessionEngine.runWithExternalThrottling();
await sessionEngine.runWithBuiltInThrottling();
var sessionListReport = new SessionListReport(appInfo, 'reports',logger);
sessionListReport.generate();
