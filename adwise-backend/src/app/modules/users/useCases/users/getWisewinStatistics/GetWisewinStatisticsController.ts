import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetWisewinStatisticsDTO } from "./GetWisewinStatisticsDTO";

export class GetWisewinStatisticsController extends HTTPController<GetWisewinStatisticsDTO.Request, GetWisewinStatisticsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetWisewinStatisticsDTO.Request = {
            userId: req.decoded?.userId || '',
            wisewinId: req.params.id as string
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