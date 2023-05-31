import * as path from 'path';
import {
  WebPageThrottledAuditOrchestrator,
}
  from './src/index.js';

//get current working directory
const configFullPath = path.join(process.cwd(), 'throttedRunConfig.json');
const auditRunner = new WebPageThrottledAuditOrchestrator(configFullPath);
await auditRunner.run(true);
