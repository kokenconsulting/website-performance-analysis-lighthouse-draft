
/*

Data Models

### Analysis Result
* [string] ProjectName - Name of the project e.g. MAGR
* [string] Git Repo Url - Github Repo Url 
* [string] Git Branch Name - e.g. main
* [string] Session ID - uuid4
* [string] Initiated By - The process or person who initiated the scan
* [string] Execution Environment- e.g. Jenkins, Github actions 
* [string] Start DateTime - Start Time of analysis
* [string] End DateTime - End Time of analysis
* [string] Network Throttle in kbps
* [string] CPU Slow Down Multiplier
* [string] Load Time - Interactive
* [string] Load Time - Speed Index

*/
// app information class that consist of projectname, gitrepourl, gitbranchname
export class CPUSlowDownMultiplierImpact {
    constructor(appInfo, networkSpeedList, cpuSlowDownMultiplierResultsList) {
      this.appInfo = appInfo;
      this.networkSpeedList = networkSpeedList;
      this.cpuSlowDownMultiplierResultsList = cpuSlowDownMultiplierResultsList;
    }
  
    toJson() {
      //return a json object consisting on non-function properties
      return JSON.parse(JSON.stringify(this));
    }
  }
// module.exports = CPUSlowDownMultiplierImpact;