import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CorrectBalanceDTO } from "./CorrectBalanceDTO";

export class CorrectBalanceController extends HTTPController<CorrectBalanceDTO.Request, CorrectBalanceDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CorrectBalanceDTO.Request = {
            change: req.body.change,
            walletId: req.params.id,
            type: req.body.type
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