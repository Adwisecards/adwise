import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetOrganizationPaymentTypeDTO } from "./SetOrganizationPaymentTypeDTO";

export class SetOrganizationPaymentTypeController extends HTTPController<SetOrganizationPaymentTypeDTO.Request, SetOrganizationPaymentTypeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetOrganizationPaymentTypeDTO.Request = {
            organizationId: req.params.id,
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