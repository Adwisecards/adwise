import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { ChangeEmployeeRoleDTO } from "./ChangeEmployeeRoleDTO";

export class ChangeEmployeeRoleController extends HTTPController<ChangeEmployeeRoleDTO.Request, ChangeEmployeeRoleDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: ChangeEmployeeRoleDTO.Request = {
            employeeId: req.params.id,
            role: req.body.role
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