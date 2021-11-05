import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationDocumentDTO } from "./GetOrganizationDocumentDTO";

export class GetOrganizationDocumentController extends HTTPController<GetOrganizationDocumentDTO.Request, GetOrganizationDocumentDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationDocumentDTO.Request = {
            organizationDocumentId: req.params.id
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