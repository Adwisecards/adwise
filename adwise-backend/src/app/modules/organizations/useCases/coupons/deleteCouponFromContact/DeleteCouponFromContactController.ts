import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteCouponFromContactDTO } from "./DeleteCouponFromContactDTO";

export class DeleteCouponFromContactController extends HTTPController<DeleteCouponFromContactDTO.Request, DeleteCouponFromContactDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteCouponFromContactDTO.Request = {
            couponId: req.params.id,
            contactId: req.body.contactId
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