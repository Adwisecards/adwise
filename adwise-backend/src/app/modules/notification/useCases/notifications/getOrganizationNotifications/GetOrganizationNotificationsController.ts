import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationNotificationsDTO } from "./GetOrganizationNotificationsDTO";

export class GetOrganizationNotificationsController extends HTTPController<GetOrganizationNotificationsDTO.Request, GetOrganizationNotificationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationNotificationsDTO.Request = {
            limit: Number(req.query.limit),
            page: Number(req.query.page),
            organizationId: req.params.id,
            search: req.query.search as string,
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