import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserFinancialStatisticsDTO } from "./GetUserFinancialStatisticsDTO";

export class GetUserFinancialStatisticsController extends HTTPController<GetUserFinancialStatisticsDTO.Request, GetUserFinancialStatisticsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: GetUserFinancialStatisticsDTO.Request = {
                userId: req.decoded.userId || '',
                optimized: req.query.optimized == '1' ? true : false
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
        } catch (ex) {
            console.log(ex);
        }
    }
}