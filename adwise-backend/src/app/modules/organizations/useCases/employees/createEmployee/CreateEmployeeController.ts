import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateEmployeeDTO } from "./CreateEmployeeDTO";

export class CreateEmployeeController extends HTTPController<CreateEmployeeDTO.Request, CreateEmployeeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateEmployeeDTO.Request = {
            organizationId: req.body.organizationId,
            contactId: req.body.contactId,
            role: req.body.role,
            defaultCashier: false
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