import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CheckLegalInnDTO } from "./CheckLegalInnDTO";

export class CheckLegalInnController extends HTTPController<CheckLegalInnDTO.Request, CheckLegalInnDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CheckLegalInnDTO.Request = {
            inn: req.params.inn
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