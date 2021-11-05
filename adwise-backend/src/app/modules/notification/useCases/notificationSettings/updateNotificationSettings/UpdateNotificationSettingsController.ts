import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateNotificationSettingsDTO } from "./UpdateNotificationSettingsDTO";

export class UpdateNotificationSettingsController extends HTTPController<UpdateNotificationSettingsDTO.Request, UpdateNotificationSettingsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateNotificationSettingsDTO.Request = {
            userId: req.decoded.userId,
            contact: req.body.contact,
            coupon: req.body.coupon,
            ref: req.body.ref,
            restrictedOrganizations: req.body.restrictedOrganizations
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