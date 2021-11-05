import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetOrganizationDisabledDTO } from "./SetOrganizationDisabledDTO";

export class SetOrganizationDisabledController extends HTTPController<SetOrganizationDisabledDTO.Request, SetOrganizationDisabledDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetOrganizationDisabledDTO.Request = {
            organizationId: req.params.id,
            disabled: req.body.disabled
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