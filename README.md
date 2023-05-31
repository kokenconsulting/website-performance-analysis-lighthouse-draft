# Website Performance Analysis via Lighthouse 

## Usage 

## Folder Structure

- reports
    - application_list.json
    - <AppName>
        - <AppName>_webpage_list.json
        - WebPageId
            - <WebPageId>_environment_list_report.json
            - <Environment>
                - ChartJsData
                    - <WebPageId>_<Environment>_throttledAudit_cpu_<cpu>_network_<network>chartdata.json
                - ThrottledAudits
                    - <WebPageId>_<Environment>_audit_list.json
                    - <auditInstanceId>
                        - <auditInstanceId>>_overview_report.json
                        - ChartJsData
                            - <auditInstance>_throttledAudit_chartdata.json
                        - LighthouseFullReports
                            - <auditInstanceId>_cpu_<cpu>_network_<network>_lighthouse_full_report.json 
                        - AuditReports 
                            - <auditInstanceId>_cpu_<cpu>_network_<network>_audit_report.json
                        
                
            

## Concepts

### Lighthouse Audit

### Lighthouse Audit Summary

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
