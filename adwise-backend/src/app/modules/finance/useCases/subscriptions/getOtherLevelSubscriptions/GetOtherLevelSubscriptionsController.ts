import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOtherLevelSubscriptionsDTO } from "./GetOtherLevelSubscriptionsDTO";

export class GetOtherLevelSubscriptionsController extends HTTPController<GetOtherLevelSubscriptionsDTO.Request, GetOtherLevelSubscriptionsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOtherLevelSubscriptionsDTO.Request = {
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