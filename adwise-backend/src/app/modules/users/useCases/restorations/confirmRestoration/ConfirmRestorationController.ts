import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { ConfirmRestorationDTO } from "./ConfirmRestorationDTO";

export class ConfirmRestorationController extends HTTPController<ConfirmRestorationDTO.Request, ConfirmRestorationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto:ConfirmRestorationDTO.Request = {
            restorationId: req.params.id,
            code: req.body.code
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