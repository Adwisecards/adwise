import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetUserRoleDTO } from "./SetUserRoleDTO";

export class SetUserRoleController extends HTTPController<SetUserRoleDTO.Request, SetUserRoleDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetUserRoleDTO.Request = {
            role: req.body.role,
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