import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateTransactionDTO } from "./CreateTransactionDTO";

export class CreateTransactionController extends HTTPController<CreateTransactionDTO.Request, CreateTransactionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateTransactionDTO.Request = {
            currency: req.body.currency,
            sum: req.body.sum,
            from: req.body.from,
            to: req.body.to,
            type: req.body.type,
            frozen: req.body.frozen
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