import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateRestorationDTO } from "./CreateRestorationDTO";

export class CreateRestorationController extends HTTPController<CreateRestorationDTO.Request, CreateRestorationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto:CreateRestorationDTO.Request = {
            email: req.body.email,
            phone: req.body.phone,
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