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

import { runAnalysis, AppInfo, logInfo,cpuSlowDownMultiplierImpactAnalysis,generateDataForSession,runAnalysisWithExternalThrottling } from 'website-performance-analysis-lighthouse-draft';
import * as path from 'path';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

const githubRepoUrl = 'https://github.com/FedEx/eai-3538872-documentation';
const githubBranchName = 'main'
const appName = 'MagicRating'
const appVersion = '0.0.1'
const url = 'http://lighthouse-magr.fedex.com/magr/app/#'
const appInfo = new AppInfo(appName, appVersion, githubRepoUrl, githubBranchName, "mjs script")
const localReportsFolderPath = './reports'


const sessionId = uuidv4();
logInfo(`session id is ${sessionId}`);

var reportsFolderAbsolutePath = path.resolve(localReportsFolderPath);
logInfo(`Saving reports to ${reportsFolderAbsolutePath}`)
await runAnalysisWithExternalThrottling(appInfo, url, reportsFolderAbsolutePath,sessionId);
logInfo(`starting summary for ${sessionId}`);
await generateDataForSession(appInfo, reportsFolderAbsolutePath, sessionId);
cpuSlowDownMultiplierImpactAnalysis(appInfo,sessionId,reportsFolderAbsolutePath);

````


