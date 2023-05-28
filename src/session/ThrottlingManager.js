import { start, stop } from '@sitespeed.io/throttle';

export class ThrottlingManager {
  constructor(logger) 
  {
    this.logger = logger;
  }

  async startThrottling(networkSpeed) {
    const options = { up: networkSpeed.throughputKbps, down: networkSpeed.throughputKbps, rtt: networkSpeed.rttMs };
    this.logger.logInfo(`Starting @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
    await start(options);
  }

  async stopThrottling(networkSpeed) {
    const options = { up: networkSpeed.throughputKbps, down: networkSpeed.throughputKbps, rtt: networkSpeed.rttMs };
    this.logger.logInfo(`Stopping @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
    await stop();
  }
}