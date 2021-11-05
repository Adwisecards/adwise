import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetOrganizationCashDTO } from "./SetOrganizationCashDTO";

export class SetOrganizationCashController extends HTTPController<SetOrganizationCashDTO.Request, SetOrganizationCashDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetOrganizationCashDTO.Request = {
            organizationId: req.params.id,
            cash: req.body.cash
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