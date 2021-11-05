import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SendEnrollmentRequestDTO } from "./SendEnrollmentRequestDTO";

export class SendEnrollmentRequestController extends HTTPController<SendEnrollmentRequestDTO.Request, SendEnrollmentRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SendEnrollmentRequestDTO.Request = {
            comment: req.body.comment,
            userId: req.decoded.userId,
            files: [],
            managerNeeded: req.body.managerNeeded == 'true',
            packetId: req.body.packetId,
            email: req.body.email
        };

        const files: SendEnrollmentRequestDTO.Request['files'] = [];

        if (req.files && req.files!.files) {
            for (const file of req.files!.files as any) {
                files.push({
                    data: file.data,
                    filename: file.name
                });
            }
        }

        if (files.length) {
            dto.files = files;
        }

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