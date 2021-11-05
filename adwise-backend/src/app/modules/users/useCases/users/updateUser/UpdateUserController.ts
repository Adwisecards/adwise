import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateUserDTO } from "./UpdateUserDTO";

export class UpdateUserController extends HTTPController<UpdateUserDTO.Request, UpdateUserDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateUserDTO.Request = {
            activity: req.body.activity,
            description: req.body.description,
            email: req.body.email,
            fb: req.body.fb,
            insta: req.body.insta,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            vk: req.body.vk,
            userId: req.decoded.userId,
            website: req.body.website,
            dob: req.body.dob,
            gender: req.body.gender,
            password: req.body.password,
            pictureFile: req.files && req.files!.picture ? {
                data: req.files!.picture.data,
                filename: req.files!.picture.name
            } : undefined as any,
            legal: req.body.legal,
            pictureMediaId: req.body.pictureMediaId
        };

        if (req.body.legal && typeof req.body.legal == 'string') {
            try {
                dto.legal = JSON.parse(req.body.legal.trim());
            } catch (ex) {
                console.log(ex);
                dto.legal = undefined as any;
            }
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