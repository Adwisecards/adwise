import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetFirstLevelSubscriptionsDTO } from "./GetFirstLevelSubscriptionsDTO";

export class GetFirstLevelSubscriptionsController extends HTTPController<GetFirstLevelSubscriptionsDTO.Request, GetFirstLevelSubscriptionsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetFirstLevelSubscriptionsDTO.Request = {
            userId: req.decoded.userId
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