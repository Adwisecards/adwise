import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { PayDepositWalletDTO } from "./PayDepositWalletDTO";

export class PayDepositWalletController extends HTTPController<PayDepositWalletDTO.Request, PayDepositWalletDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: PayDepositWalletDTO.Request = {
            sum: req.body.sum,
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