import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindOrganizationsDTO } from "./FindOrganizationsDTO";

export class FindOrganizationsController extends HTTPController<FindOrganizationsDTO.Request, FindOrganizationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindOrganizationsDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 10,
            page: Number.parseInt(req.query.page as string) || 1,
            search: req.query.search as string || '',
            userId: req.decoded.userId,
            inCity: true || req.query.cityBound == '1',
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