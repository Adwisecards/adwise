import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteAdvantageDTO } from "./DeleteAdvantageDTO";

export class DeleteAdvantageController extends HTTPController<DeleteAdvantageDTO.Request, DeleteAdvantageDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteAdvantageDTO.Request = {
            advantageId: req.params.id
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