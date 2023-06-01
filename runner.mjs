import * as path from 'path';
import {
  WebPageThrottledAuditOrchestrator,
}
  from './src/index.js';

async function GoogleSupportLP() {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/Google-Support-LP.json');
  const auditRunner = new WebPageThrottledAuditOrchestrator(configFullPath);
  await auditRunner.run(true);
}
async function MagicRatingLandingL6(){
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/MagicRating-Landing-L6.json');
  const auditRunner = new WebPageThrottledAuditOrchestrator(configFullPath);
  await auditRunner.run(true);
}
async function MagicRatingLandingLP(){
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/MagicRating-Landing-LP.json');
  const auditRunner = new WebPageThrottledAuditOrchestrator(configFullPath);
  await auditRunner.run(true);
}

await GoogleSupportLP();
await MagicRatingLandingL6();
await MagicRatingLandingLP();