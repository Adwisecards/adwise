import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateMessageDTO } from "./CreateMessageDTO";

export class CreateMessageController extends HTTPController<CreateMessageDTO.Request, CreateMessageDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateMessageDTO.Request = {
            body: {
                media: req.body.media,
                text: req.body.text
            },
            chatId: req.body.chatId,
            fromUserId: req.decoded.userId
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