import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationDTO } from "./GetOrganizationDTO";

export class GetOrganizationController extends HTTPController<GetOrganizationDTO.Request, GetOrganizationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationDTO.Request = {
            organizationId: req.params.id,
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