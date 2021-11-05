import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserCardDTO } from "./GetUserCardDTO";

export class GetUserCardController extends HTTPController<GetUserCardDTO.Request, GetUserCardDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserCardDTO.Request = {
            userId: req.decoded.userId
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