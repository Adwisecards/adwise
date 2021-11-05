import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteVerificationDTO } from "./DeleteVerificationDTO";
import { DeleteVerificationUseCase } from "./DeleteVerificationUseCase";

export class DeleteVerificationController extends HTTPController<DeleteVerificationDTO.Request, DeleteVerificationDTO.Response> {
    constructor(useCase: DeleteVerificationUseCase) {
        super(useCase);
    }

    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteVerificationDTO.Request = {
            code: req.query.code as string || '',
            verificationId: req.params.id
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