import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetEmployeeRatingDTO } from "./GetEmployeeRatingDTO";

export class GetEmployeeRatingController extends HTTPController<GetEmployeeRatingDTO.Request, GetEmployeeRatingDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetEmployeeRatingDTO.Request = {
            employeeRatingId: req.params.id
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