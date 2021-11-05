import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetWithdrawalRequestDataDTO } from "./GetWithdrawalRequestDataDTO";

export class GetWithdrawalRequestDataController extends HTTPController<GetWithdrawalRequestDataDTO.Request, GetWithdrawalRequestDataDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetWithdrawalRequestDataDTO.Request = {
            withdrawalRequestToken: req.params.token
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