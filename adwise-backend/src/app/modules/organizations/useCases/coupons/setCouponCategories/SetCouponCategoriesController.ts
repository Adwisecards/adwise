import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetCouponCategoriesDTO } from "./SetCouponCategoriesDTO";

export class SetCouponCategoriesController extends HTTPController<SetCouponCategoriesDTO.Request, SetCouponCategoriesDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetCouponCategoriesDTO.Request = {
            couponId: req.params.id,
            couponCategoryIds: req.body.couponCategoryIds,
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