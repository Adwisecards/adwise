import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateLegalDTO } from "./CreateLegalDTO";

export class CreateLegalController extends HTTPController<CreateLegalDTO.Request, CreateLegalDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateLegalDTO.Request = {
            country: req.body.country,
            form: req.body.form,
            info: req.body.info,
            organizationId: req.body.organizationId,
            userId: req.decoded.userId,
            relevant: req.body.relevant
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