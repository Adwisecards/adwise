import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddCouponToContactDTO } from "./AddCouponToContactDTO";

export class AddCouponToContactController extends HTTPController<AddCouponToContactDTO.Request, AddCouponToContactDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddCouponToContactDTO.Request = {
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