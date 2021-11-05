import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetCouponIndecesDTO } from "./SetCouponIndecesDTO";

export class SetCouponIndecesController extends HTTPController<SetCouponIndecesDTO.Request, SetCouponIndecesDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetCouponIndecesDTO.Request = {
            coupons: req.body.coupons
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