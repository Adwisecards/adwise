import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetOrganizationGlobalDTO } from "./SetOrganizationGlobalDTO";

export class SetOrganizationGlobalController extends HTTPController<SetOrganizationGlobalDTO.Request, SetOrganizationGlobalDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetOrganizationGlobalDTO.Request = {
            organizationId: req.params.id
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