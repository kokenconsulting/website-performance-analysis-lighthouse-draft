export class ProcessLogger {
  constructor() {}

  public logInfo(message: string): void {
    console.log(message);
  }

  public logError(message: string, err: any): void {
    console.error(message, err);
  }
}