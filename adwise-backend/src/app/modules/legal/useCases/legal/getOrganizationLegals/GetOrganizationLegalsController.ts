import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationLegalsDTO } from "./GetOrganizationLegalsDTO";

export class GetOrganizationLegalsController extends HTTPController<GetOrganizationLegalsDTO.Request, GetOrganizationLegalsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationLegalsDTO.Request = {
            organizationId: req.params.id,
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