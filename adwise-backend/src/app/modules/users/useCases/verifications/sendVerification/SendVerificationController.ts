import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SendVerificationDTO } from "./SendVerificationDTO";

export class SendVerificationController extends HTTPController<SendVerificationDTO.Request, SendVerificationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SendVerificationDTO.Request = {
            userId: req.decoded.userId || ''
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