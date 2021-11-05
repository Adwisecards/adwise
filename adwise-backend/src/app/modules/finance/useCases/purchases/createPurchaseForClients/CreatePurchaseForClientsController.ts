import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreatePurchaseForClientsDTO } from "./CreatePurchaseForClientsDTO";

export class CreatePurchaseForClientsController extends HTTPController<CreatePurchaseForClientsDTO.Request, CreatePurchaseForClientsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreatePurchaseForClientsDTO.Request = {
            cashierContactId: req.body.cashierContactId,
            coupons: req.body.coupons || [],
            description: req.body.description,
            purchaserContactIds: req.body.purchaserContactIds || [],
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