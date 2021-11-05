import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserTreeDTO } from "./GetUserTreeDTO";

export class GetUserTreeController extends HTTPController<GetUserTreeDTO.Request, GetUserTreeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: GetUserTreeDTO.Request = {
                userId: req.params.id,
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