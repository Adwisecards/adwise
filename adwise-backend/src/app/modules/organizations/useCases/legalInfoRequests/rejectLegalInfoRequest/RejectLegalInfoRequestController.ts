import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { RejectLegalInfoRequestDTO } from "./RejectLegalInfoRequestDTO";

export class RejectLegalInfoRequestController extends HTTPController<RejectLegalInfoRequestDTO.Request, RejectLegalInfoRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: RejectLegalInfoRequestDTO.Request = {
            legalInfoRequestId: req.params.id,
            rejectionReason: req.body.rejectionReason
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