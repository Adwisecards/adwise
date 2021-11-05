import * as expressWs from "express-ws";
import {Router} from 'express';
import { applyAuth } from "../../../../services/server/implementation/middleware/middlewares";
import { listenToUserEventsController } from "../../useCases/listenToUserEvents";

const globalWsRouter = (): any => {
    const router = (<any>Router());
    // router.use(applyAuth);
    (<any>router).ws('/listen-user-events/:id', (ws: any, req: any) => listenToUserEventsController.execute(ws, req));

    return router;
};

export {
    globalWsRouter
};