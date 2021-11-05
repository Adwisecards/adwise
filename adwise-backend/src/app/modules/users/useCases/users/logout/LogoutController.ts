import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { LogoutDTO } from "./LogoutDTO";

export class LogoutController extends HTTPController<LogoutDTO.Request, LogoutDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: LogoutDTO.Request = {
            userId: req.decoded.userId
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;
        this.success(res, {data}, {
            cookies: [{
                key: 'authentication',
                value: '',
                options: {
                    age: 0,
                    httpOnly: true,
                    secure: false
                }
            }],
            headers: []
        });
    }
}