import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { CreateLogDTO } from "./CreateLogDTO";

export class CreateLogController extends HTTPController<CreateLogDTO.Request, CreateLogDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateLogDTO.Request = {
            app: req.body.app,
            event: req.body.event,
            isError: req.body.isError,
            meta: req.body.meta,
            platform: req.body.platform,
            userId: req.decoded?.userId,
            message: req.body.message
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;
        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}