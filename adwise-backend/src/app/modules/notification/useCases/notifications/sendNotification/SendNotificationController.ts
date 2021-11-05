import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SendNotificationDTO } from "./SendNotificationDTO";

export class SendNotificationController extends HTTPController<SendNotificationDTO.Request, SendNotificationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SendNotificationDTO.Request = {
            body: req.body.body,
            data: req.body.data,
            receiverGroupId: req.body.receiverGroupId,
            receiverIds: req.body.receiverIds,
            title: req.body.title,
            type: req.body.type,
            userId: req.decoded.userId,
            asOrganization: req.body.asOrganization
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