import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteEmployeeDTO } from "./DeleteEmployeeDTO";

export class DeleteEmployeeController extends HTTPController<DeleteEmployeeDTO.Request, DeleteEmployeeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteEmployeeDTO.Request = {
            employeeId: req.params.id
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