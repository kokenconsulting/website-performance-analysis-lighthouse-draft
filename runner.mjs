import * as path from 'path';
import {
  WebPageThrottledAuditRunner,
}
  from './src/index.js';

//get current working directory
const configFullPath = path.join(process.cwd(), 'throttedRunConfig.json');
const auditRunner = new WebPageThrottledAuditRunner(configFullPath);
await auditRunner.run(true);
