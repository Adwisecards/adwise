import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateLegalWithdrawalRequestDTO } from "./CreateLegalWithdrawalRequestDTO";

export class CreateLegalWithdrawalRequestController extends HTTPController<CreateLegalWithdrawalRequestDTO.Request, CreateLegalWithdrawalRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateLegalWithdrawalRequestDTO.Request = {
            sum: req.body.sum,
            comment: req.body.comment,
            userId: req.decoded.userId,
            walletId: req.body.walletId,
            timestamp: req.body.timestamp
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