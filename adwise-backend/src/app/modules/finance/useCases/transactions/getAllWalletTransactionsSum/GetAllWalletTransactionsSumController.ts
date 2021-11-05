import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetAllWalletTransactionsSumDTO } from "./GetAllWalletTransactionsSumDTO";

export class GetAllWalletTransactionsSumController extends HTTPController<GetAllWalletTransactionsSumDTO.Request, GetAllWalletTransactionsSumDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetAllWalletTransactionsSumDTO.Request = {
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