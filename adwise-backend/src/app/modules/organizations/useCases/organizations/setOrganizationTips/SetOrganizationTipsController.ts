import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetOrganizationTipsDTO } from "./SetOrganizationTipsDTO";

export class SetOrganizationTipsController extends HTTPController<SetOrganizationTipsDTO.Request, SetOrganizationTipsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetOrganizationTipsDTO.Request = {
            organizationId: req.params.id,
            tips: req.body.tips
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