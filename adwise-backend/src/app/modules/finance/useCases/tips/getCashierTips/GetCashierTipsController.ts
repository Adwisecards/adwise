import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetCashierTipsDTO } from "./GetCashierTipsDTO";

export class GetCashierTipsController extends HTTPController<GetCashierTipsDTO.Request, GetCashierTipsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetCashierTipsDTO.Request = {
            cashierContactId: req.params.id,
            limit: Number(req.query.limit) || 10,
            page: Number(req.query.page) || 1,
            all: req.query.all == '1' ? true : false
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