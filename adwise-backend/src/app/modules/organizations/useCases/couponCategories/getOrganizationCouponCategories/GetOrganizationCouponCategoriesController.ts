import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationCouponCategoriesDTO } from "./GetOrganizationCouponCategoriesDTO";

export class GetOrganizationCouponCategoriesController extends HTTPController<GetOrganizationCouponCategoriesDTO.Request, GetOrganizationCouponCategoriesDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationCouponCategoriesDTO.Request = {
            organizationId: req.params.id,
            disabled: req.query.disabled ? req.query.disabled == '1' : undefined
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