import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateVersionDTO } from "./CreateVersionDTO";

export class CreateVersionController extends HTTPController<CreateVersionDTO.Request, CreateVersionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateVersionDTO.Request = {
            comment: req.body.comment,
            date: req.body.date,
            title: req.body.title,
            type: req.body.type,
            version: req.body.version
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