// import { IHTTPRequest } from "./interfaces/IHTTPRequest";
// import { IHTTPResponse } from "./interfaces/IHTTPResponse";
import { IUseCase } from "./interfaces/IUseCase";
import { UseCaseError } from "./UseCaseError";
import Express from 'express';
import { logger } from "../../services/logger";

interface ISuccessfulResponse<T> {
    data: T;
};

interface IUnsuccessfulResponse {
    error: UseCaseError;
};

interface IResponseCookie {
    key: string;
    value: string;
    options: {
        age: number;
        httpOnly: boolean;
        secure: boolean;
    };
};

interface IResponseHeader {
    key: string;
    value: string;
};

// HTTPController is an abstract class that implements base express.js controller's methods
export abstract class HTTPController<Request, Response> {
    protected useCase: IUseCase<Request, Response>;
    constructor(useCase: IUseCase<Request, Response>) {
        this.useCase = useCase;
    }

    public async execute(req: Express.Request, res: Express.Response) {
        try {
            await this.executeImplementation(req, res);
        } catch (ex) {
            this.handleError(res, ex);
        }
    }

    protected abstract async executeImplementation(req: Express.Request, res: Express.Response): Promise<void>;

    protected success<T>(res: Express.Response, data: ISuccessfulResponse<T>, options: {
        cookies: IResponseCookie[];
        headers: IResponseHeader[];
    }) {
        for (const cookie of options.cookies) {
            res.cookie(cookie.key, cookie.value, cookie.options);
        }

        for (const header of options.headers) {
            res.setHeader(header.key, header.value);
        }

        res.status(200).json(data);
    }

    private failure(res: Express.Response, error: IUnsuccessfulResponse, options: {
        cookies: IResponseCookie[];
        headers: IResponseHeader[];
    }) {
        for (const cookie of options.cookies) {
            res.cookie(cookie.key, cookie.value, cookie.options);
        }

        for (const header of options.headers) {
            res.setHeader(header.key, header.value);
        }

        res.status(error.error.HTTPStatus).json({
            error: {
                code: error.error.code,
                message: error.error.message,
                HTTPStatus: error.error.HTTPStatus,
                details: error.error.details
            }
        });
    }

    protected handleError(res: Express.Response, error: UseCaseError) {
        return this.failure(res, {
            error
        }, {
            cookies: [],
            headers: []
        });
    }
}