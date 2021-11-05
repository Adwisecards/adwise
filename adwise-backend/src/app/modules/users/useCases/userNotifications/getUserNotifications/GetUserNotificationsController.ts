import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserNotificationsDTO } from "./GetUserNotificationsDTO";

export class GetUserNotificationsController extends HTTPController<GetUserNotificationsDTO.Request, GetUserNotificationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserNotificationsDTO.Request = {
            userId: req.decoded.userId,
            limit: Number(req.query.limit),
            page: Number(req.query.page),
            seen: req.query.seen == '1'
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