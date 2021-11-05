import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetWalletBalanceDTO } from "./GetWalletBalanceDTO";

export class GetWalletBalanceController extends HTTPController<GetWalletBalanceDTO.Request, GetWalletBalanceDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetWalletBalanceDTO.Request = {
            userId: req.decoded.userId,
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