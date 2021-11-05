import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateGlobalDTO } from "./UpdateGlobalDTO";

export class UpdateGlobalController extends HTTPController<UpdateGlobalDTO.Request, UpdateGlobalDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateGlobalDTO.Request = {
            managerPercent: req.body.managerPercent,
            managerPoints: req.body.managerPoints,
            purchasePercent: req.body.purchasePercent,
            balanceUnfreezeTerms: req.body.balanceUnfreezeTerms,
            contactEmail: req.body.contactEmail,
            spareContactEmails: req.body.spareContactEmails,
            technicalWorks: req.body.technicalWorks,
            tipsMinimalAmount: req.body.tipsMinimalAmount,
            minimalPayment: req.body.minimalPayment,
            maximumPayment: req.body.maximumPayment,
            paymentGatewayPercent: req.body.paymentGatewayPercent,
            paymentGatewayMinimalFee: req.body.paymentGatewayMinimalFee,
            paymentRetention: req.body.paymentRetention,
            app: req.body.app
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