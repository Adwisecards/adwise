import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DepositWalletDTO } from "./DepositWalletDTO";

export class DepositWalletController extends HTTPController<DepositWalletDTO.Request, DepositWalletDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DepositWalletDTO.Request = {
            sumInPoints: req.body.sumInPoints,
            userId: req.params.id
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