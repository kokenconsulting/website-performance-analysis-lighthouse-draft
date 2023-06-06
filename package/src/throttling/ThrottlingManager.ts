import { start, stop } from '@sitespeed.io/throttle';
import { ProcessLogger } from '../log/ProcessLogger_Rename.js'


export class ThrottlingManager {
  private logger: ProcessLogger;

  constructor(logger: ProcessLogger) {
    this.logger = logger;
  }

  async startThrottling(options: { up: number; down: number; rtt: number }): Promise<void> {
    this.logger.logInfo(`Starting @sitespeed.io/throttle throttling with options ${JSON.stringify(options)}`);
    await start(options);
  }

  async stopThrottling(): Promise<void> {
    await stop();
  }
}