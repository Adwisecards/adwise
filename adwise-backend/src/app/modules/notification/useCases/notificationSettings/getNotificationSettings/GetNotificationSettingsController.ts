import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetNotificationSettingsDTO } from "./GetNotificationSettingsDTO";

export class GetNotificationSettingsController extends HTTPController<GetNotificationSettingsDTO.Request, GetNotificationSettingsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetNotificationSettingsDTO.Request = {
            userId: req.decoded.userId
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