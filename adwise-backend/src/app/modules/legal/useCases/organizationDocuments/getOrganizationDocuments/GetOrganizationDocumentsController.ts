import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationDocumentsDTO } from "./GetOrganizationDocumentsDTO";

export class GetOrganizationDocumentsController extends HTTPController<GetOrganizationDocumentsDTO.Request, GetOrganizationDocumentsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationDocumentsDTO.Request = {
            organizationId: req.params.id,
            // userId: req.decoded.userId,
            type: req.query.type as any
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