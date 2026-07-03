export declare class LoggerService {
    private readonly logger;
    constructor();
    info(message: string, context?: any): void;
    error(message: string, trace?: string, context?: any): void;
    warn(message: string, context?: any): void;
    debug(message: string, context?: any): void;
}
