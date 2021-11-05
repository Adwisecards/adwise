import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetSystemLogFilenamesDTO } from "./GetSystemLogFilenamesDTO";

export class GetSystemLogFilenamesController extends HTTPController<GetSystemLogFilenamesDTO.Request, GetSystemLogFilenamesDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetSystemLogFilenamesDTO.Request = {

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