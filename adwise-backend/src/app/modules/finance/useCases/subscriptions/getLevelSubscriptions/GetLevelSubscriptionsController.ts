import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetLevelSubscriptionsDTO } from "./GetLevelSubscriptionsDTO";

export class GetLevelSubscriptionsController extends HTTPController<GetLevelSubscriptionsDTO.Request, GetLevelSubscriptionsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetLevelSubscriptionsDTO.Request = {
            userId: req.decoded.userId,
            organizationId: req.params.id
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