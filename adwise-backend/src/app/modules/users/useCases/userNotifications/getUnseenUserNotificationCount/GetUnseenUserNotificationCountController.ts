import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUnseenUserNotificationCountDTO } from "./GetUnseenUserNotificationCountDTO";

export class GetUnseenUserNotificationCountController extends HTTPController<GetUnseenUserNotificationCountDTO.Request, GetUnseenUserNotificationCountDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUnseenUserNotificationCountDTO.Request = {
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