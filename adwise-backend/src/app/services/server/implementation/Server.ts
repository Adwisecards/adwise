import { IServer } from "../IServer";
import express from 'express';
import { middlewareMounter } from "./middleware";
import { v1Router } from "./api/v1";
import expressWs, { Application } from 'express-ws';
import { configProps } from "../../config";
// import { v2Router } from "./api/v2";

import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';

export class Server implements IServer {
    private app: Application;
    constructor() {
        this.app = express() as any;
        expressWs(this.app);
        this.app.disable('x-powered-by');

        Bugsnag.start({
            apiKey: configProps.bugsnagKey,
            plugins: [BugsnagPluginExpress],
        })

        const bugsnagMiddleware = Bugsnag.getPlugin('express');

        this.app.use(bugsnagMiddleware!.requestHandler);
        this.app.use(bugsnagMiddleware!.errorHandler);
    }

    private mountApi(): void {
        this.app.use('/v1', v1Router());
        // this.app.use('/v2', v2Router());
    }

    public start(port: number): Promise<any> {
        this.mountMiddlewares();
        this.mountApi();

        return new Promise<any>((resolve, reject) => {
            const httpServer = this.app.listen(port, () => {
                resolve(httpServer);
            });
            this.app.on('error', err => {
                reject(err);
            });
        });
    }

    private async mountMiddlewares() {
        this.app = middlewareMounter.mount(this.app);
    }
}