import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetEmployeeDTO } from "./GetEmployeeDTO";

export class GetEmployeeController extends HTTPController<GetEmployeeDTO.Request, GetEmployeeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetEmployeeDTO.Request = {
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