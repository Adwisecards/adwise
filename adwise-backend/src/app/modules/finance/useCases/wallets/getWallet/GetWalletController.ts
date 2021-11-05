import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetWalletDTO } from "./GetWalletDTO";

export class GetWalletController extends HTTPController<GetWalletDTO.Request, GetWalletDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetWalletDTO.Request = {
            organization: req.query.organization == '1',
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