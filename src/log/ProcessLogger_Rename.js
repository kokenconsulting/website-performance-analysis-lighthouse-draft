export class ProcessLogger {
  constructor() {}

  logInfo(message) {
    console.log(message);
  }
  logError(message,err) {
    console.error(message,err);
  }
}