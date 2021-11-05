import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationEmployeesDTO } from "./GetOrganizationEmployeesDTO";

export class GetOrganizationEmployeesController extends HTTPController<GetOrganizationEmployeesDTO.Request, GetOrganizationEmployeesDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationEmployeesDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 10,
            page: Number.parseInt(req.query.page as string) || 1,
            organizationId: req.params.id,
            role: req.query.role as string,
            all: req.query.all == '1'
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