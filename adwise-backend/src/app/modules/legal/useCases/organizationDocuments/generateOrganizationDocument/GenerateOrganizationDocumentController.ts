import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GenerateOrganizationDocumentDTO } from "./GenerateOrganizationDocumentDTO";

export class GenerateOrganizationDocumentController extends HTTPController<GenerateOrganizationDocumentDTO.Request, GenerateOrganizationDocumentDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GenerateOrganizationDocumentDTO.Request = {
            organizationId: req.body.organizationId,
            type: req.body.type,
            userId: req.decoded.userId,
            options: req.body.options,
            asNew: req.body.asNew
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