import { database } from "./services/database";
import { logger } from "./services/logger";
import { server } from "./services/server";
import { configProps } from "./services/config";
import { timeService } from "./services/timeService";
import cluster from 'cluster';
import os from 'os';

// App is a main class of this application
export class App {
    public async start() {
        process.stdout.write('\x1B[2J\x1B[0f');

        logger.info('MAIN:', 'Loading the application with pid of '+ process.pid);
        try {
            await this.loadDatabase();

            if (configProps.mode == 'httpserver') {
                await this.loadServer();

                logger.info('MAIN:', 'App is loaded as HTTP server');
            } else if (configProps.mode == 'timeservice') {
                await this.startTimeService();

                logger.info('MAIN:', 'App is loaded as time service');
            } else {
                await this.loadServer();
                await this.startTimeService();

                logger.info('MAIN:', 'App is loaded as HTTP server with time service running');
            }
        } catch (ex) {
            logger.error(ex.stack, 'MAIN:', ex.message, '. Exit');
            process.exit(1);
        }
    }

    public async startCluster() {
        try {
            if (cluster.isMaster) {
                process.stdout.write('\x1B[2J\x1B[0f');
                logger.info('MAIN:', 'Loading the application with pid of '+ process.pid);
                logger.info('MAIN:', 'App is loaded as cluster');

                const cpus = os.cpus().length;

                await this.loadDatabase();

                for (let i = 0; i < cpus; i++) {
                    cluster.fork();
                }
            } else {
                await this.loadServer();
            }
        } catch (ex) {
            logger.error(ex.stack, 'MAIN:', ex.message, '. Exit');
            process.exit(1);
        }
    }

    public async loadDatabase() {
        logger.info('DB:', 'Connecting to the database');

        try {
            const connection = await database.connect(configProps.databaseUrl, {
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useNewUrlParser: true
            });
            logger.info('DB:', 'Connected to database at', connection.client.s.url);
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            logger.error('', 'DB', 'Cannot continue without database. Exit');
            process.exit(1);
        }
    }

    public async loadServer() {
        logger.info('HTTP SERVER:', 'Starting HTTP server')

        try {
            const httpServer = await server.start(configProps.port);
            logger.info('HTTP SERVER:', 'Started successfully. Listening at port:', httpServer.address().port)
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            logger.error('', 'HTTP SERVER:', 'Cannot continue without HTTP server. Exit');
            process.exit(1);
        }
    }

    public async startTimeService() {
        logger.info('TIME SERVICE:', 'Starting time service')

        try {
            const isSuccess = timeService.start(configProps.timeServiceInterval);
            if (!isSuccess) {
                throw new Error('Cannot start time service');
            }
            logger.info('TIME SERVICE:', 'Started successfully. Inteval is set to: ' + configProps.timeServiceInterval.toString());
        } catch (ex) {
            logger.error(ex.stack, ex.message);
            logger.error('', 'TIME SERVICE:', 'Cannot continue without time service. Exit');
            process.exit(1);
        }
    }
}