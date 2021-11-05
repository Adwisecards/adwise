import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SatisfyLegalInfoRequestDTO } from "./SatisfyLegalInfoRequestDTO";

export class SatisfyLegalInfoRequestController extends HTTPController<SatisfyLegalInfoRequestDTO.Request, SatisfyLegalInfoRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SatisfyLegalInfoRequestDTO.Request = {
            legalInfoRequestId: req.params.id
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