import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { RestorePasswordDTO } from "./RestorePasswordDTO";

export class RestorePasswordController extends HTTPController<RestorePasswordDTO.Request, RestorePasswordDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto:RestorePasswordDTO.Request = {
            password: req.body.password,
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