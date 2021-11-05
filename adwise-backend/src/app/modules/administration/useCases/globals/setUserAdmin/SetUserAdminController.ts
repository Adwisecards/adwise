import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetUserAdminDTO } from "./SetUserAdminDTO";

export class SetUserAdminController extends HTTPController<SetUserAdminDTO.Request, SetUserAdminDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetUserAdminDTO.Request = {
            admin: req.body.admin,
            userId: req.params.id     
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