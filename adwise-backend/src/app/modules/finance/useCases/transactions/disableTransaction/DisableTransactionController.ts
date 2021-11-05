import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DisableTransactionDTO } from "./DisableTransactionDTO";

export class DisableTransactionController extends HTTPController<DisableTransactionDTO.Request, DisableTransactionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DisableTransactionDTO.Request = {
            disabled: req.body.disabled,
            transactionId: req.params.id
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