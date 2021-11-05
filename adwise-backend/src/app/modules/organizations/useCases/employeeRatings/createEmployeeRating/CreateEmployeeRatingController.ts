import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateEmployeeRatingDTO } from "./CreateEmployeeRatingDTO";

export class CreateEmployeeRatingController extends HTTPController<CreateEmployeeRatingDTO.Request, CreateEmployeeRatingDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: CreateEmployeeRatingDTO.Request = {
                comment: req.body.comment,
                employeeContactId: req.body.employeeContactId,
                purchaserContactId: req.body.purchaserContactId,
                rating: req.body.rating,
                purchaserUserId: req.decoded.userId,
                purchaseId: req.body.purchaseId
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