import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SendRestorationCodeDTO } from "./SendRestorationCodeDTO";

export class SendRestorationCodeController extends HTTPController<SendRestorationCodeDTO.Request, SendRestorationCodeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SendRestorationCodeDTO.Request = {
            restorationId: req.params.id
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