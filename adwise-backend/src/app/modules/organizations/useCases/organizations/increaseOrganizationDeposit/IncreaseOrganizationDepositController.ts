import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { IncreaseOrganizationDepositDTO } from "./IncreaseOrganizationDepositDTO";

export class IncreaseOrganizationDepositController extends HTTPController<IncreaseOrganizationDepositDTO.Request, IncreaseOrganizationDepositDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: IncreaseOrganizationDepositDTO.Request = {
            organizationId: req.params.id,
            sum: req.body.sum,
            userId: req.decoded.userId
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