import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetPurchasePassDTO } from "./GetPurchasePassDTO";

export class GetPurchasePassController extends HTTPController<GetPurchasePassDTO.Request, GetPurchasePassDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetPurchasePassDTO.Request = {
            purchaseId: req.params.id
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;
        
        res.setHeader('content-type', 'application/vnd.apple.pkpass');
        res.setHeader('content-disposition', 'attachment; filename=purchase.pkpass');

        res.status(200).send(data.pass);
    }
}