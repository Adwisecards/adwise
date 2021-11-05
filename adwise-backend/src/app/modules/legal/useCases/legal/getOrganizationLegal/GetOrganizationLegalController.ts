import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationLegalDTO } from "./GetOrganizationLegalDTO";

export class GetOrganizationLegalController extends HTTPController<GetOrganizationLegalDTO.Request, GetOrganizationLegalDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationLegalDTO.Request = {
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