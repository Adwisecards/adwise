import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateSubscriptionDTO } from "./CreateSubscriptionDTO";

export class CreateSubscriptionController extends HTTPController<CreateSubscriptionDTO.Request, CreateSubscriptionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateSubscriptionDTO.Request = {
            ...req.body,
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