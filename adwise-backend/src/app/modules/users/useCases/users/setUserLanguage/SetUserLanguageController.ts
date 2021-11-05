import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetUserLanguageDTO } from "./SetUserLanguageDTO";

export class SetUserLanguageController extends HTTPController<SetUserLanguageDTO.Request, SetUserLanguageDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetUserLanguageDTO.Request = {
            language: req.body.language,
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