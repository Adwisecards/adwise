import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetSystemLogFileDTO } from "./GetSystemLogFileDTO";

export class GetSystemLogFileController extends HTTPController<GetSystemLogFileDTO.Request, GetSystemLogFileDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetSystemLogFileDTO.Request = {
            systemLogFilename: req.params.filename
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