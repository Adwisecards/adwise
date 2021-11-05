import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { RequestCallDTO } from "./RequestCallDTO";

export class RequestCallController extends HTTPController<RequestCallDTO.Request, RequestCallDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: RequestCallDTO.Request = {
            email: req.body.email,
            name: req.body.name
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