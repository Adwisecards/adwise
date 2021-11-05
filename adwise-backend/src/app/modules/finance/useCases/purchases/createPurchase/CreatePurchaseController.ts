import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreatePurchaseDTO } from "./CreatePurchaseDTO";

export class CreatePurchaseController extends HTTPController<CreatePurchaseDTO.Request, CreatePurchaseDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreatePurchaseDTO.Request = {
            cashierContactId: req.body.cashierContactId,
            coupons: req.body.coupons || [],
            description: req.body.description,
            purchaserContactId: req.body.purchaserContactId,
            asOrganization: req.body.asOrganization,
            userId: req.decoded.userId
        };

        if (!dto.coupons.length && req.body.couponId) {
            dto.coupons = [{
                count: 1,
                couponId: req.body.couponId
            }];
        }

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