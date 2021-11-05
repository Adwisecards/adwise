import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationNotificationsDTO } from "./GetOrganizationNotificationsDTO";

export class GetOrganizationNotificationsController extends HTTPController<GetOrganizationNotificationsDTO.Request, GetOrganizationNotificationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationNotificationsDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 10,
            page: Number.parseInt(req.query.page as string) || 1,
            userId: req.decoded.userId,
            organizationId: req.params.id,
            seen: req.query.seen == '1'
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