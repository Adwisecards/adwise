import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetManagerDTO } from "./SetManagerDTO";

export class SetManagerController extends HTTPController<SetManagerDTO.Request, SetManagerDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetManagerDTO.Request = {
            organizationId: req.params.id,
            userManagerRefCode: req.body.userManagerRefCode
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