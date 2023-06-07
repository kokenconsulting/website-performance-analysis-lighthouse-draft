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

Web Page contains two key properties : url and environment. 
Performance Monitor will start throttled audit session for a specific web page on a specific environment. 
### Lighthouse Audit
Lighthouse Audit is the atomic concept for Web Application Performance Analysis Library. 

It is only responsible for running a lighthouse audit with a given set of configuration. 
In the case of Web Application Performance Analysis Library, the confuguration comes with throttling settings

### Throttled Audit
Throttled Audit is a wrapper for Lighthouse Audit. 
It will contain relevant configuration and results for the lighthouse audit. 

### Throttled Audit Run
Thorttle Audit Run will run 

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


## Notes

git remote set-url origin git@github.com-kokenconsulting:kokenconsulting/website-performance-analysis-lighthouse-draft.git