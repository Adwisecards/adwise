import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetVerificationDTO } from "./GetVerificationDTO";
import { GetVerificationUseCase } from "./GetVerificationUseCase";

export class GetVerificationController extends HTTPController<GetVerificationDTO.Request, GetVerificationDTO.Response> {
    constructor(useCase: GetVerificationUseCase) {
        super(useCase);
    }

    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetVerificationDTO.Request = {
            userId: req.decoded.userId || ''
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