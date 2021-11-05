import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetCouponDisabledDTO } from "./SetCouponDisabledDTO";

export class SetCouponDisabledController extends HTTPController<SetCouponDisabledDTO.Request, SetCouponDisabledDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetCouponDisabledDTO.Request = {
            couponId: req.params.id,
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