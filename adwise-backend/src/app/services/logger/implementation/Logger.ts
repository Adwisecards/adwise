import { ILogger, ILogFile } from "../ILogger";
import * as winston from 'winston';
import { Writable } from "stream";
import path from 'path';
import { configProps } from "../../config";
require('winston-mongodb');
import os from 'os';
import { Result } from "../../../core/models/Result";
import fs from 'fs';

export class Logger implements ILogger {
    public path: string;
    public level: string;
    public transport: string;
    public mongodbUrl: string;
    public mongodbCollection: string;
    public expiration: number;

    private logger: winston.Logger;
    constructor(level: string, transport: string, path: string, _: string, mongodbUrl: string, mongodbCollection: string, expiration: number) {
        this.level = level;
        this.transport = transport;
        this.path = path;
        this.logger = this.configureLogger();
        this.mongodbUrl = mongodbUrl;
        this.mongodbCollection = mongodbCollection;
        this.expiration = expiration;
    }

    public getLogFiles(): Promise<Result<ILogFile[] | null, Error | null>> {
        return new Promise<Result<ILogFile[] | null, Error | null>>((resolve) => {
            const logFiles: ILogFile[] = [];
            
            fs.readdir(this.path, (err, files) => {
                if (err) {
                    return resolve(Result.fail(err));
                }

                for (const file of files) {
                    const filePath = path.join(this.path, file);

                    try {
                        const buffer = fs.readFileSync(filePath);

                        logFiles.push({
                            data: buffer,
                            filename: file
                        });
                    } catch (ex) {
                        return resolve(Result.fail(ex));
                    }
                }

                return resolve(Result.ok(logFiles));
            });
        });
    }

    info(...messages: string[]) {
        this.logger.info(messages.join(' '));
    }

    infoWithMeta(message: string, meta: any) {
        this.logger.info(message, meta);
    }

    error(stack: string, ...messages: string[]) {
        const error = new Error(messages.join(' '));
        if (stack) error.stack = stack;
        
        this.logger.error(messages.join(' '));
    }

    warn(...messages: string[]) {
        this.logger.warn(messages.join(' '));
    }

    http(...messages: string[]) {
        this.logger.http(messages.join(' '));
    }

    httpWithMeta(message: string, meta: any) {
        this.logger.info(message, meta);
    }

    debug(...messages: string[]) {
        this.logger.debug(messages.join(' '));
    }

    get httpLevelStream(): Writable {
        const writable = new Writable({
            write: (message, _, done) => {
                this.http(message.toString('utf8'));
                done();
            }
        });

        return writable;
    }

    get infoLevelStream(): Writable {
        return new Writable({
            write: (message, _, done) => {
                this.info(message);
                done();
            }
        });
    }

    get warnLevelStream(): Writable {
        return new Writable({
            write: (message, _, done) => {
                this.warn(message);
                done();
            }
        });
    }

    get errorLevelStream(): Writable {
        return new Writable({
            write: (message, _, done) => {
                this.error(message);
                done();
            }
        });
    }

    get debugLevelStream(): Writable {
        return new Writable({
            write: (message, _, done) => {
                this.error(message);
                done();
            }
        });
    }

    private configureLogger(): winston.Logger {
        const options: winston.LoggerOptions = {
            level: this.level
        };

        if (this.transport === 'file') {
            const fileTransport = new winston.transports.File({
                filename: `${path.join(this.path, new Date().toISOString())}.log`,
            });
            options.transports = [fileTransport];
            options.format = winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD hh:mm:ss A ZZ'
                  }),
                  winston.format.json()
            );
        } else if (this.transport === 'console') {
            const consoleTransport = new winston.transports.Console();
            options.transports = [consoleTransport];
            options.format = winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.align(),
                winston.format.printf(info => `${info.timestamp} ${info.level} ${info.message}`)
            );
        } else if (this.transport == 'mongodb') {
            const mongodbTransport = new (<any>winston.transports).MongoDB({
                level: 'debug',
                db: configProps.databaseUrl,
                collection: 'logs',
                options: {},
                storeHost: false,
                expireAfterSeconds: 2.628e+6,
            });

            options.transports = [mongodbTransport];
            options.format = winston.format.combine(winston.format.timestamp({
                format: 'YYYY-MM-DD hh:mm:ss A ZZ'
              }),
              winston.format.json())
        }

        return winston.createLogger(options);
    }
}