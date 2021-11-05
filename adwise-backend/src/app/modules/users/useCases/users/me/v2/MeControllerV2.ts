import { Request, Response } from "express";
import { HTTPController } from "../../../../../../core/models/HTTPController";
import { MeDTOV2 } from "./MeDTOV2";

export class MeControllerV2 extends HTTPController<MeDTOV2.Request, MeDTOV2.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: MeDTOV2.Request = {
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
        this.success(res, {data: "фывфвфыв"}, {
            cookies: [],
            headers: []
        });
    }
}