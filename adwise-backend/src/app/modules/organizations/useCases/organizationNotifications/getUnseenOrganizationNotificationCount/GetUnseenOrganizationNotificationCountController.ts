import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUnseenOrganizationNotificationCountDTO } from "./GetUnseenOrganizationNotificationCountDTO";

export class GetUnseenOrganizationNotificationCountController extends HTTPController<GetUnseenOrganizationNotificationCountDTO.Request, GetUnseenOrganizationNotificationCountDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUnseenOrganizationNotificationCountDTO.Request = {
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