import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { MeDTO } from "./MeDTO";
import { MeUseCase } from "./MeUseCase";

export class MeController extends HTTPController<MeDTO.Request, MeDTO.Response> {
    constructor(useCase: MeUseCase) {
        super(useCase);
    }

    protected async executeImplementation(req: Request, res: Response) {
        const dto: MeDTO.Request = {
            userId: req.decoded.userId || '',
            isOrganization: req.query.organization == '1',
            populateEmployee: req.query.populateEmployee == '1',
            platform: req.query.platform as string,
            language: req.query.language as any
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