import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetManagerOperationsDTO } from "./GetManagerOperationsDTO";

export class GetManagerOperationsController extends HTTPController<GetManagerOperationsDTO.Request, GetManagerOperationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetManagerOperationsDTO.Request = {
            userId: req.decoded.userId,
            limit: Number(req.query.limit) || 10,
            page: Number(req.query.page) || 10
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