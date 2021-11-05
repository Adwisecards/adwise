import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserDocumentsDTO } from "./GetUserDocumentsDTO";

export class GetUserDocumentsController extends HTTPController<GetUserDocumentsDTO.Request, GetUserDocumentsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserDocumentsDTO.Request = {
            userId: req.decoded.userId,
            type: req.query.type as string
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