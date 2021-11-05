import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetCouponDocumentsDTO } from "./GetCouponDocumentsDTO";

export class GetCouponDocumentsController extends HTTPController<GetCouponDocumentsDTO.Request, GetCouponDocumentsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetCouponDocumentsDTO.Request = {
            couponId: req.params.id
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