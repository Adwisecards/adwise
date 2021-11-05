import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetOrganizationSignedDTO } from "./SetOrganizationSignedDTO";

export class SetOrganizationSignedController extends HTTPController<SetOrganizationSignedDTO.Request, SetOrganizationSignedDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetOrganizationSignedDTO.Request = {
            organizationId: req.params.id,
            signed: req.body.signed
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