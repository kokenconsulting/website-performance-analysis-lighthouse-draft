# Website Performance Analysis via Lighthouse 

## Usage 

### Prerequisites
* Node js version 16 and above. 

### Push new versions of the package
````shell
export NPM_TOKEN=<your_token>
````

in .npmrc file, add following:
//registry.npmjs.org/:_authToken=${NPM_TOKEN}

````shell
npm publish
````
### Instructions

- Install the package globally
```` shell
npm i -g website-performance-analysis-lighthouse-draft 
````

- Create a mjs file

```` javascript

import { runAnalysis, WebApplication, logInfo,prepareThrottlingChartDataForSession,createSummaryForSession,runAnalysisWithExternalThrottling } from 'website-performance-analysis-lighthouse-draft';
import * as path from 'path';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

const githubRepoUrl = 'https://github.com/FedEx/eai-3538872-documentation';
const githubBranchName = 'main'
const appName = 'MagicRating'
const appVersion = '0.0.1'
const url = 'http://lighthouse-magr.fedex.com/magr/app/#'
const webApplication = new WebApplication(appName, appVersion, githubRepoUrl, githubBranchName, "mjs script")
const localReportsFolderPath = './reports'


const auditInstanceId = uuidv4();
logInfo(`session id is ${auditInstanceId}`);

var reportsFolderAbsolutePath = path.resolve(localReportsFolderPath);
logInfo(`Saving reports to ${reportsFolderAbsolutePath}`)
await runAnalysisWithExternalThrottling(webApplication, url, reportsFolderAbsolutePath,auditInstanceId);
logInfo(`starting summary for ${auditInstanceId}`);
await createSummaryForSession(webApplication, reportsFolderAbsolutePath, auditInstanceId);
prepareThrottlingChartDataForSession(webApplication,auditInstanceId,reportsFolderAbsolutePath);

````


