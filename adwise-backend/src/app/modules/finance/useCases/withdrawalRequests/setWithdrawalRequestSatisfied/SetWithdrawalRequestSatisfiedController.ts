import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetWithdrawalRequestSatisfiedDTO } from "./SetWithdrawalRequestSatisfiedDTO";

export class SetWithdrawalRequestSatisfiedController extends HTTPController<SetWithdrawalRequestSatisfiedDTO.Request, SetWithdrawalRequestSatisfiedDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetWithdrawalRequestSatisfiedDTO.Request = {
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