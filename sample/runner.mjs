import * as path from 'path';
import {
  WebPageThrottledAuditRunner,
}
  from '../src/index.js';

  //get current working directory
const confifFullPath = path.join(process.cwd(), 'sample/config.json');
await new WebPageThrottledAuditRunner(confifFullPath).run(false);