import { ProcessLogger } from "../log/ProcessLogger.js";

export class EngineBase {
    public logger: ProcessLogger;

    constructor(logger: ProcessLogger) {
        this.logger = logger;
    }
}