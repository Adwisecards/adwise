import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateOrganizationDTO } from "./CreateOrganizationDTO";

export class CreateOrganizationController extends HTTPController<CreateOrganizationDTO.Request, CreateOrganizationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: CreateOrganizationDTO.Request = {
                userId: req.decoded.userId,
                briefDescription: req.body.briefDescription,
                categoryId: req.body.categoryId,
                name: req.body.name,
                addressId: req.body.addressId,
                phones: req.body.phones,
                emails: req.body.emails,
                tags: req.body.tags,
                cashback: req.body.cashback,
                distributionSchema: req.body.distributionSchema,
                description: req.body.description,
                colors: req.body.colors,
                pictureMediaId: req.body.pictureMediaId,
                mainPictureMediaId: req.body.mainPictureMediaId,
                schedule: req.body.schedule,
                socialMedia: req.body.socialMedia,
                requestedPacketId: req.body.requestedPacketId
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
        } catch (ex) {
            console.log(ex);
        }
    }
}