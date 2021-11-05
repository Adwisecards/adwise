import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateCategoryDTO } from "./CreateCategoryDTO";

export class CreateCategoryController extends HTTPController<CreateCategoryDTO.Request, CreateCategoryDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateCategoryDTO.Request = {
            name: req.body.name
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