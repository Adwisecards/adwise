import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetEmployeeRatingsDTO } from "./GetEmployeeRatingsDTO";

export class GetEmployeeRatingsController extends HTTPController<GetEmployeeRatingsDTO.Request, GetEmployeeRatingsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetEmployeeRatingsDTO.Request = {
            employeeId: req.params.id,
            limit: Number(req.query.limit) || undefined as any,
            page: Number(req.query.page) || undefined as any
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