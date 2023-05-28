import * as fs from 'fs';
import {
  WebApplication,
  ProcessLogger,
  SessionEngine,
  SessionListReport,
  SessionConfiguration,
  ThrottlingSettings
}
  from '../src/index.js';

//read config json and parse it
console.log(`Working directory: ${process.cwd()}`);
const config = JSON.parse(fs.readFileSync('./sample/config.json', 'utf8'));
//print working directory

const application = new WebApplication(
  config.Application.name,
  config.Application.version,
  config.Application.description,
  config.Application.GitUrl,
  config.Application.GitBranch,
  config.Application.Environment
);

const throttlingSettings = new ThrottlingSettings(
  config.ThrottlingSettings.NetworkSpeeds,
  config.ThrottlingSettings.CPUSlowDownMultipliers
);

const sessionConfiguration = new SessionConfiguration(config.Url,config.ReportFolderRelativePath,application, throttlingSettings);

const logger = new ProcessLogger();
var sessionEngine = new SessionEngine(sessionConfiguration, logger);
//await sessionEngine.runWithExternalThrottling();
await sessionEngine.runWithBuiltInThrottling();
var sessionListReport = new SessionListReport(sessionConfiguration.webApplication, config.ReportFolderRelativePath, logger);
sessionListReport.generate();
