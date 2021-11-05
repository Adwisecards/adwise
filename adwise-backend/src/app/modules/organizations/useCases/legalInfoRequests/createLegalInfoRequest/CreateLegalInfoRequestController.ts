import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateLegalInfoRequestDTO } from "./CreateLegalInfoRequestDTO";

export class CreateLegalInfoRequestController extends HTTPController<CreateLegalInfoRequestDTO.Request, CreateLegalInfoRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateLegalInfoRequestDTO.Request = {
            legalId: req.body.legalId,
            categoryId: req.body.categoryId,
            name: req.body.name,
            addressId: req.body.addressId,
            organizationId: req.body.organizationId,
            userId: req.decoded.userId,
            comment: req.body.comment,
            emails: req.body.emails,
            phones: req.body.phones
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