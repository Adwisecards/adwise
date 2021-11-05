import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateWithdrawalRequestDTO } from "./UpdateWithdrawalRequestDTO";

export class UpdateWithdrawalRequestController extends HTTPController<UpdateWithdrawalRequestDTO.Request, UpdateWithdrawalRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateWithdrawalRequestDTO.Request = {
            withdrawalRequestId: req.params.id,
            sum: req.body.sum,
            comment: req.body.comment,
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