import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetWalletDepositDTO } from "./SetWalletDepositDTO";

export class SetWalletDepositController extends HTTPController<SetWalletDepositDTO.Request, SetWalletDepositDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetWalletDepositDTO.Request = {
            userId: req.decoded.userId,
            isAdmin: req.decoded.admin,
            deposit: req.body.deposit,
            walletId: req.params.id
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