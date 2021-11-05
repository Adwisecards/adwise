import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteCategoryDTO } from "./DeleteCategoryDTO";

export class DeleteCategoryController extends HTTPController<DeleteCategoryDTO.Request, DeleteCategoryDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteCategoryDTO.Request = {
            categoryId: req.params.id
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