import { Result } from "../../core/models/Result";

export interface ILogFile {
    filename: string;
    data: Buffer;
};

export interface ILogger {
    path: string;
    level: string;
    transport: string;
    error(...messages: string[]): void;
    info(...messages: string[]): void;
    warn(...messages: string[]): void;
    http(...messages: string[]): void;
    debug(...messages: string[]): void;

    getLogFiles(): Promise<Result<ILogFile[] | null, Error | null>>;
};
