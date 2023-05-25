import * as chromeLauncher from 'chrome-launcher';
//import {chromeLauncher} from 'chrome-launcher';
import * as fs from 'fs';
import lighthouse from 'lighthouse';
//const lighthouse = import('lighthouse');


const maxWaitForFcp = 1000000
const maxWaitForLoad = 2000000
const formFactor = "desktop"

export async function engine(url, networkSpeed, cpuSlowdownMultiplier,externalNetworkSpeed=null) {

    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless','--ignore-certificate-errors']
    });

    //lighthouseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    var lighthouseConfig = {settings:{}};
    lighthouseConfig.extends = 'lighthouse:default';
    if(externalNetworkSpeed!=null){
        lighthouseConfig.settings.externalNetworkSpeed = externalNetworkSpeed;
    }
    lighthouseConfig.settings.formFactor = formFactor;
    lighthouseConfig.settings.maxWaitForFcp = maxWaitForFcp;
    lighthouseConfig.settings.maxWaitForLoad = maxWaitForLoad;
    lighthouseConfig.settings.screenEmulation = { mobile: false };
    //throttling explanation -> https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md
    lighthouseConfig.settings.throttlingMethod = "devtools";
    lighthouseConfig.settings.throttling = {
        cpuSlowdownMultiplier: cpuSlowdownMultiplier,
        //delay before server gives initial response... usually in milliseconds.
        //this is the ping... 
        requestLatencyMs: networkSpeed.rttMs,
        downloadThroughputKbps: networkSpeed.throughputKbps,
        //usually doesn't really matter - we are not uploading any data
        //might be useful when uploading images/forms/documents etc.
        uploadThroughputKbps: networkSpeed.throughputKbps,
    };

    const options = {
        port: chrome.port,
        //try performance 
        //onlyCategories: ['performance', 'accessibility'],
        onlyCategories: ['performance'],
        output: 'json',
        logLevel: 'info',
        screenEmulation: {
            mobile: false,
            width: 800,
            height: 600,
            deviceScaleFactor: 1,
            disabled: true,
        },
    };

    const runnerResult = await lighthouse(url, options, lighthouseConfig);
    await chrome.kill();

    const report = runnerResult.report;
    const jsonReport = JSON.parse(report);
    return jsonReport;
};

