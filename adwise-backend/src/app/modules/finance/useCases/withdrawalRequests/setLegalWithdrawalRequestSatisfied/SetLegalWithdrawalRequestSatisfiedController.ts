import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetLegalWithdrawalRequestSatisfiedDTO } from "./SetLegalWithdrawalRequestSatisfiedDTO";

export class SetLegalWithdrawalRequestSatisfiedController extends HTTPController<SetLegalWithdrawalRequestSatisfiedDTO.Request, SetLegalWithdrawalRequestSatisfiedDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetLegalWithdrawalRequestSatisfiedDTO.Request = {
            withdrawalRequestId: req.params.id
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