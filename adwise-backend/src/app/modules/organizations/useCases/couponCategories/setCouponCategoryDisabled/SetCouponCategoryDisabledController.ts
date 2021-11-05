import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetCouponCategoryDisabledDTO } from "./SetCouponCategoryDisabledDTO";

export class SetCouponCategoryDisabledController extends HTTPController<SetCouponCategoryDisabledDTO.Request, SetCouponCategoryDisabledDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetCouponCategoryDisabledDTO.Request = {
            couponCategoryId: req.params.id,
            userId: req.decoded.userId,
            disabled: req.body.disabled
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