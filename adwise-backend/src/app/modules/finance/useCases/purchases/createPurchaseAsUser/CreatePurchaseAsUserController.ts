import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreatePurchaseAsUserDTO } from "./CreatePurchaseAsUserDTO";

export class CreatePurchaseAsUserController extends HTTPController<CreatePurchaseAsUserDTO.Request, CreatePurchaseAsUserDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreatePurchaseAsUserDTO.Request = {
            purchaserContactId: req.body.purchaserContactId,
            purchaseId: req.params.id,
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