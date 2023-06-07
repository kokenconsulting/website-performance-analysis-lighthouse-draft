import { ProcessLogger } from "../Log/ProcessLogger.js";

export class EngineBase {
    public logger: ProcessLogger;

    constructor(logger: ProcessLogger) {
        this.logger = logger;
    }
}