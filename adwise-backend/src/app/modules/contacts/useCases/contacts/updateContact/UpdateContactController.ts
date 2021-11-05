import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateContactDTO } from "./UpdateContactDTO";

export class UpdateContactController extends HTTPController<UpdateContactDTO.Request, UpdateContactDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateContactDTO.Request = {
            activity: req.body.activity,
            description: req.body.description,
            email: req.body.email,
            fb: req.body.fb,
            insta: req.body.insta,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            vk: req.body.vk,
            contactId: req.params.id,
            website: req.body.website,
            color: req.body.color,
            pictureFile: req.files && req.files!.picture ? {
                data: req.files!.picture.data,
                filename: req.files!.picture.name
            } : undefined as any,
            tipsMessage: req.body.tipsMessage,
            pictureMediaId: req.body.pictureMediaId
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