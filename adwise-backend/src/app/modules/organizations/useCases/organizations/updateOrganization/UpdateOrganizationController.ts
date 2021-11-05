import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateOrganizationDTO } from "./UpdateOrganizationDTO";

export class UpdateOrganizationController extends HTTPController<UpdateOrganizationDTO.Request, UpdateOrganizationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: UpdateOrganizationDTO.Request = {
                userId: req.decoded.userId,
                organizationId: req.params.id,
                phones: req.body.phones,
                emails: req.body.emails,
                tags: req.body.tags,
                pictureMediaId: req.body.pictureMediaId,
                mainPictureMediaId: req.body.mainPictureMediaId,
                addressCoords: req.body.addressCoords,
                addressId: req.body.addressId,
                briefDescription: req.body.briefDescription,
                cashback: req.body.cashback,
                categoryId: req.body.categoryId,
                colors: req.body.colors,
                description: req.body.description,
                distributionSchema: req.body.distributionSchema,
                socialMedia: req.body.socialMedia,
                website: req.body.website,
                schedule: req.body.schedule
            };
    
            const result = await this.useCase.execute(dto);
            console.log(result);
            
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