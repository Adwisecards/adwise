import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetRefTreeOfOrganizationDTO } from "./GetRefTreeOfOrganizationDTO";

export class GetRefTreeOfOrganizationController extends HTTPController<GetRefTreeOfOrganizationDTO.Request, GetRefTreeOfOrganizationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetRefTreeOfOrganizationDTO.Request = {
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