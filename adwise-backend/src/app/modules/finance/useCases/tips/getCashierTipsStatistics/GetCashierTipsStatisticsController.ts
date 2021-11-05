import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetCashierTipsStatisticsDTO } from "./GetCashierTipsStatisticsDTO";

export class GetCashierTipsStatisticsController extends HTTPController<GetCashierTipsStatisticsDTO.Request, GetCashierTipsStatisticsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetCashierTipsStatisticsDTO.Request = {
            cashierContactId: req.params.id
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