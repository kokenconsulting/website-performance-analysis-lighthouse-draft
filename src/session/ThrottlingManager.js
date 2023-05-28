import { start, stop } from '@sitespeed.io/throttle';

export class ThrottlingManager {
  constructor(logger) 
  {
    this.logger = logger;
  }

  async startThrottling(options) {
    //const options = { up: networkSpeed.throughputKbps, down: networkSpeed.throughputKbps, rtt: networkSpeed.rttMs };
    this.logger.logInfo(`Starting @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
    await start(options);
  }

  async stopThrottling() {
    await stop();
  }
}