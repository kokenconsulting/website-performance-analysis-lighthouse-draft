# Website Performance Analysis via Lighthouse 

## Usage 

See [Sample Client Repo Readme](https://github.com/kokenconsulting/client-for-website-performance-analysis-lighthouse/tree/docs)

## Why do we have this library?

[Google Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) is an automated tool for improving the quality of web pages.
This tool can be run against any web page, public or requiring authentication. 
It has audits for performance, accessibility, progressive web apps, SEO, and more.

We are currently using performance audit capability from [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
## Concepts

### Performance Monitor

Performance Monitor is the main process that triggers Throttled Audit for a specific WebPage (in a specific environment). 
[The orchestrator]() is the easiest way to start the audit process and will make sure that the Report UI contains

### Web Page

Web Page is the entity whose performance is measured. 
Web Page contains two key properties : url and environment. An throttled audit session will be started for 
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
