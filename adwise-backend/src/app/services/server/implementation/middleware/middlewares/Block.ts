import { NextFunction, Request, Response } from "express";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../../../modules/administration/repo/globals/IGlobalRepo";
import { configProps } from "../../../../config";
import { IMiddleware } from "../IMiddleware";

export class Block implements IMiddleware {
    private globalRepo: IGlobalRepo;

    constructor(globalRepo: IGlobalRepo) {
        this.globalRepo = globalRepo;
    }

    public async apply(req: Request, res: Response, next: NextFunction) {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const accessKey = req.headers['x-access-key'];

        if (accessKey == configProps.accessKey) {
            return next();
        }
        
        if (global.technicalWorks) {
            return res.status(503).send({
                error: {
                    code: "228",
                    message: "Service is temporarily unavailable",
                    HTTPStatus: 503,
                    details: "Service is temporarily unavailable"
                }
            });
        }

        return next();
    }
}