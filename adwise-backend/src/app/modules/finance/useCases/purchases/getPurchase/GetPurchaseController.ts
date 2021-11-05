import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetPurchaseDTO } from "./GetPurchaseDTO";

export class GetPurchaseController extends HTTPController<GetPurchaseDTO.Request, GetPurchaseDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetPurchaseDTO.Request = {
            purchaseId: req.params.id,
            multiple: req.query.multiple == '1',
            userId: req.decoded.userId
        };
        
        try {
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