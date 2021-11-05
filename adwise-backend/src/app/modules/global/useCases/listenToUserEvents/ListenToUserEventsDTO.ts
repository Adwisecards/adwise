import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import {} from 'express-ws';
import WebSocket from "ws";

export namespace ListenToUserEventsDTO {
    export interface Request {
        ws: WebSocket
        userId: string;
        type: 'close' | 'open';
    };

    export interface ResponseData {

    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};