import express from 'express';
import bodyParser = require("body-parser");
import compression = require("compression");
import cookieParser = require("cookie-parser");
import expressFileupload = require('express-fileupload');
import { configProps } from '../../../config';
import cors from 'cors';
import path from 'path';
import { ping, proxyRouter, push } from '../systemControllers/proxyRouter';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger/spec.json';
import {Application} from 'express-ws';
import morgan from 'morgan';
import { logger } from '../../../logger';
import morganBody from 'morgan-body';

export class MiddlewareMounter {
    public mount(expressApplication: Application): Application {
        expressApplication.use(cors({
            optionsSuccessStatus: 200,
            origin: true,
            credentials: true,
            preflightContinue: true
        }));

        expressApplication.use(bodyParser.json({
            limit: configProps.maxUploadLimit,
        }));

        expressApplication.use(bodyParser.urlencoded({
            limit: configProps.maxUploadLimit,
            parameterLimit: Number(configProps.maxParameterLimit),
            extended: true
        }));

        expressApplication.use(expressFileupload({
            limits: {
                fileSize: 50*1024*1024
            }
        }));

        expressApplication.use(cookieParser());
        expressApplication.use(compression());
        expressApplication.use('/public', (<any>express.static)(path.join(__dirname, '..', 'public')));
        expressApplication.use('/proxy', proxyRouter);
        expressApplication.post('/push', push);
        expressApplication.use('/ping', ping);
        // DOCUMENTATION
        expressApplication.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


        morganBody(expressApplication, {
            stream: logger.httpLevelStream,
            noColors: true,
            immediateReqLog: false,
            logAllReqHeader: true
        });

        return expressApplication;
    }
}