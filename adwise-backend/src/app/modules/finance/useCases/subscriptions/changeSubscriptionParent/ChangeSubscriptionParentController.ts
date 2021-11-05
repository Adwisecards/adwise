import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { ChangeSubscriptionParentDTO } from "./ChangeSubscriptionParentDTO";

export class ChangeSubscriptionParentController extends HTTPController<ChangeSubscriptionParentDTO.Request, ChangeSubscriptionParentDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: ChangeSubscriptionParentDTO.Request = {
                parentId: req.body.parentId,
                subscriptionId: req.params.id,
                reason: req.body.reason
            };
    
            const result = await this.useCase.execute(dto);
            if (result.isFailure) {
                console.log(result);
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