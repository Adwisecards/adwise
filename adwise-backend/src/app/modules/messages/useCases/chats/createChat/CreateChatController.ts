import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateChatDTO } from "./CreateChatDTO";

export class CreateChatController extends HTTPController<CreateChatDTO.Request, CreateChatDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: CreateChatDTO.Request = {
                fromUserId: req.decoded.userId,
                to: req.body.to,
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
        } catch (ex) {
            console.log(ex);
        }
    }
}