import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateCouponDTO } from "./CreateCouponDTO";

export class CreateCouponController extends HTTPController<CreateCouponDTO.Request, CreateCouponDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateCouponDTO.Request = {
            distributionSchema: req.body.distributionSchema,
            index: req.body.index,
            type: req.body.type,
            pictureMediaId: req.body.pictureMediaId,
            ageRestricted: req.body.ageRestricted,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            locationAddressId: req.body.locationAddressId,
            name: req.body.name,
            offerPercent: req.body.offerPercent,
            offerPoints: req.body.offerPoints,
            offerType: req.body.offerType,
            organizationId: req.body.organizationId,
            price: req.body.price,
            quantity: req.body.quantity,
            userId: req.decoded.userId,
            documentMediaId: req.body.documentMediaId,
            termsDocumentMediaId: req.body.termsDocumentMediaId,
            couponCategoryIds: req.body.couponCategoryIds,
            floating: req.body.floating,
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