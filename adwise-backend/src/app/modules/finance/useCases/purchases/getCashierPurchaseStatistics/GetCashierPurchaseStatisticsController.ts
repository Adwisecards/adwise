import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetCashierPurchaseStatisticsDTO } from "./GetCashierPurchaseStatisticsDTO";

export class GetCashierPurchaseStatisticsController extends HTTPController<GetCashierPurchaseStatisticsDTO.Request, GetCashierPurchaseStatisticsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetCashierPurchaseStatisticsDTO.Request = {
            cashierUserId: req.decoded.userId
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