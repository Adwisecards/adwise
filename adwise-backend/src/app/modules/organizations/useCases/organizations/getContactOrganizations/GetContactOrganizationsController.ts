import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetContactOrganizationsDTO } from "./GetContactOrganizationsDTO";

export class GetContactOrganizationsController extends HTTPController<GetContactOrganizationsDTO.Request, GetContactOrganizationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetContactOrganizationsDTO.Request = {
            userId: req.decoded.userId,
            contactId: req.params.id,
            order: Number.parseInt(req.query.order as string) || undefined as any,
            sortBy: req.query.sortBy as string,
            limit: Number.parseInt(req.query.limit as string) || undefined as any,
            page: Number.parseInt(req.query.page as string) || undefined as any,
            search: req.query.search as string,
            categoryIds: req.query.categoryIds as string[] || []
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