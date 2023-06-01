# Website Performance Analysis via Lighthouse 

## Installation of NPM Package
- Install the package globally
```` shell
npm i -g website-performance-analysis-lighthouse-draft 
````

## Usage 
Sample Config File
```json
{
    "ReportFolderRelativePath": "./docs/reports",
    "WebPage": {
        "Id": "Test-Configuration",
        "Name": "Test-Configuration",
        "Url": "https://www.google.com/",
        "Description": "Sample Description",
        "Environment": "LP"
    },
    "Application": {
        "Id": "test-website",
        "Name": "test-website",
        "Version": "1.0.0",
        "Description": "Sample Application",
        "GitUrl": "",
        "GitBranch": "master"
    },
    "ThrottlingSettings": {
        "NetworkSpeeds": [
            {
                "rttMs": 100,
                "throughputKbps": 29500
            },
            {
                "rttMs": 100,
                "throughputKbps": 35500
            }
        ],
        "CPUSlowDownMultipliers": [
            0
        ]
    }
}
```

Run Script

```javascript
import * as path from 'path';
import {
  PerformanceMonitorOrchestrator,
}
  from 'website-performance-analysis-lighthouse-draft';

async function TestConfig() {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/test-config.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(false);
}
await TestConfig()
```        

## Concepts


### Lighthouse Audit

### Throttled Audit

### Web Page Throttled Audit Run

### Web Application List

## Terminology

### Audit

### Report


### ChartData

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
