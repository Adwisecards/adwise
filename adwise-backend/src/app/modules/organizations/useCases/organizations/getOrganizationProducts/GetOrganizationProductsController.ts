import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationProductsDTO } from "./GetOrganizationProductsDTO";

export class GetOrganizationProductsController extends HTTPController<GetOrganizationProductsDTO.Request, GetOrganizationProductsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationProductsDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 10,
            page: Number.parseInt(req.query.page as string) || 1,
            organizationId: req.params.id,
            type: req.query.type as string || ''
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