import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UnsubscribeFromOrganizationDTO } from "./UnsubscribeFromOrganizationDTO";

export class UnsubscribeFromOrganizationController extends HTTPController<UnsubscribeFromOrganizationDTO.Request, UnsubscribeFromOrganizationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UnsubscribeFromOrganizationDTO.Request = {
            contactId: req.body.contactId,
            userId: req.decoded.userId,
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