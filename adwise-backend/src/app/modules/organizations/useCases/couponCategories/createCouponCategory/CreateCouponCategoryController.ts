import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateCouponCategoryDTO } from "./CreateCouponCategoryDTO";

export class CreateCouponCategoryController extends HTTPController<CreateCouponCategoryDTO.Request, CreateCouponCategoryDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateCouponCategoryDTO.Request = {
            organizationId: req.body.organizationId,
            name: req.body.name,
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