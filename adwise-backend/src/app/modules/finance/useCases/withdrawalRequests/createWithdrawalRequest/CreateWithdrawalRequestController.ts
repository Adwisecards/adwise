import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateWithdrawalRequestDTO } from "./CreateWithdrawalRequestDTO";

export class CreateWithdrawalRequestController extends HTTPController<CreateWithdrawalRequestDTO.Request, CreateWithdrawalRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateWithdrawalRequestDTO.Request = {
            taskId: req.body.taskId,
            withdrawalRequestToken: req.body.withdrawalRequestToken,
            cryptowalletAddress: req.body.cryptowalletAddress
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