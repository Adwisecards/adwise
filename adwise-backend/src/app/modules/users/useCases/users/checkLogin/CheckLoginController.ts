import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CheckLoginDTO } from "./CheckLoginDTO";

export class CheckLoginController extends HTTPController<CheckLoginDTO.Request, CheckLoginDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CheckLoginDTO.Request = {
            login: req.params.login
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