import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { RequestPaymentTypeDTO } from "./RequestPaymentTypeDTO";

export class RequestPaymentTypeController extends HTTPController<RequestPaymentTypeDTO.Request, RequestPaymentTypeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: RequestPaymentTypeDTO.Request = {
            organizationId: req.params.id,
            userId: req.decoded.userId,
            paymentType: req.body.paymentType
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