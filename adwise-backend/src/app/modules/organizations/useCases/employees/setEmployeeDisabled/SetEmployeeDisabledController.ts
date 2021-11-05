import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetEmployeeDisabledDTO } from "./SetEmployeeDisabledDTO";

export class SetEmployeeDisabledController extends HTTPController<SetEmployeeDisabledDTO.Request, SetEmployeeDisabledDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetEmployeeDisabledDTO.Request = {
            employeeId: req.params.id,
            disabled: req.body.disabled
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