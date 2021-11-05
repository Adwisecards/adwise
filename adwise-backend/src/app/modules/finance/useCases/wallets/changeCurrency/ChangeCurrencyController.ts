import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { ChangeCurrencyDTO } from "./ChangeCurrencyDTO";

export class ChangeCurrencyController extends HTTPController<ChangeCurrencyDTO.Request, ChangeCurrencyDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: ChangeCurrencyDTO.Request = {
            currency: req.body.currency,
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