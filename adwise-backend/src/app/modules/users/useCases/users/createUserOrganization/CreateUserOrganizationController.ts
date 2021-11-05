// import { Request, Response } from "express";
// import ms from "ms";
// import { HTTPController } from "../../../../../core/models/HTTPController";
// import { configProps } from "../../../../../services/config";
// import { CreateUserOrganizationDTO } from "./CreateUserOrganizationDTO";

// export class CreateUserOrganizationController extends HTTPController<CreateUserOrganizationDTO.Request, CreateUserOrganizationDTO.Response> {
//     protected async executeImplementation(req: Request, res: Response) {
//         const dto: CreateUserOrganizationDTO.Request = {
//             organization: {
//                 addressId: req.body.organization.placeId,
//                 briefDescription: req.body.organization.briefDescription,
//                 categoryId: req.body.organization.categoryId,
//                 name: req.body.organization.name,
//                 phones: req.body.organization.phones ? req.body.organization.phones.split(', ') : [],
//                 emails: req.body.organization.emails ? req.body.organization.emails.split(', ') : [],
//                 tags: req.body.organization.tags ? req.body.organization.tags.split(', ') : [],
//                 type: req.body.type,
//                 distributionSchema: {
//                     first: 0,
//                     other: 0
//                 },
//                 description: req.body.description,
//                 mainPictureFile: undefined as any,
//                 pictureFile: undefined as any,
//                 cashback: req.body.cashback,
//                 legal: {
//                     country: '',
//                     form: '',
//                     info: {}
//                 },
//                 primaryColor: req.body.primaryColor
//             },
//             user: {
//                 dob: req.body.user.dob,
//                 email: req.body.user.email,
//                 phone: req.body.user.phone,
//                 firstName: req.body.user.firstName,
//                 gender: req.body.user.gender,
//                 lastName: req.body.user.lastName,
//                 password: req.body.user.password,
//                 organizationUser: true,
//                 noVerification: false,
//                 noCheck: false,
//                 parentRefCode: undefined as any
//             }
//         };

//         const result = await this.useCase.execute(dto);
//         if (result.isFailure) {
//             return this.handleError(res, result.getError()!);
//         }

//         const data = result.getValue()!;
//         this.success(res, {data}, {
//             cookies: [{
//                 key: 'authentication',
//                 value: data.jwt,
//                 options: {
//                     age: ms(configProps.jwtExpriresIn),
//                     httpOnly: true,
//                     secure: false
//                 }
//             }],
//             headers: []
//         });
//     }
// }