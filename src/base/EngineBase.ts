import { ProcessLogger } from "../log_2/ProcessLogger.js";

export class EngineBase {
    public logger: ProcessLogger;

    constructor(logger: ProcessLogger) {
        this.logger = logger;
    }
}