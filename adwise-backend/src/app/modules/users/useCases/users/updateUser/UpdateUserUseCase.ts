import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { UpdateContactUseCase } from "../../../../contacts/useCases/contacts/updateContact/UpdateContactUseCase";
import { GenerateUserDocumentUseCase } from "../../../../legal/useCases/userDocuments/generateUserDocument/GenerateUserDocumentUseCase";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { UpdateUserDTO } from "./UpdateUserDTO";
import { updateUserErrors } from "./updateUserErrors";

export class UpdateUserUseCase implements IUseCase<UpdateUserDTO.Request, UpdateUserDTO.Response> {
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;
    private mediaService: IMediaService;
    private updateContactUseCase: UpdateContactUseCase;
    private generateUserDocumentUseCase: GenerateUserDocumentUseCase;

    public errors: UseCaseError[] = [
        ...updateUserErrors
    ];

    constructor(
        userRepo: IUserRepo, 
        userValidationService: IUserValidationService, 
        mediaService: IMediaService, 
        updateContactUseCase: UpdateContactUseCase,
        generateUserDocumentUseCase: GenerateUserDocumentUseCase
    ) {
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
        this.mediaService = mediaService;
        this.updateContactUseCase = updateContactUseCase;
        this.generateUserDocumentUseCase = generateUserDocumentUseCase;
    }

    public async execute(req: UpdateUserDTO.Request): Promise<UpdateUserDTO.Response> {
        const {userId} = req; delete req.userId;
        const valid = this.userValidationService.updateData(req);
        if (!Types.ObjectId.isValid(userId!)) {
            return Result.fail(UseCaseError.create('c', 'User ID must be valid'));
        }

        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }


        const userFound = await this.userRepo.findById(userId!);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        let pictureUrl;
        if (req.pictureFile) {
            const pictureSaved = await this.mediaService.save(req.pictureFile.filename, req.pictureFile.data);
            if (pictureSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving picture'));
            }

            pictureUrl = pictureSaved.getValue()!;
        }

        req.picture = pictureUrl;


        const user = userFound.getValue()!;

        if (req.phone) {
            user.phoneInfo = req.phone;
            req.phone = undefined as any;
        }

        if (req.email) {
            user.emailInfo = req.email;
            req.email = undefined as any;
        }

        for (const key in req) {
            if (key == 'phone' || key == 'email') {
                continue;
            }

            if (key == 'pictureMediaId') {
                user.pictureMedia = req.pictureMediaId || user.pictureMedia as any;
                continue;
            }

            if (key == 'legal' && (<any>req)[key]) {
                await this.generateUserDocumentUseCase.execute({
                    userId: user._id.toString(),
                    type: 'application'
                });
            }

            if ((<any>req)[key] || (<any>req)[key] == '') {
                (<any>user)[key] = (<any>req)[key] || (<any>user)[key];
            }
        }

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        if (user.contacts.length) {
            await this.updateContactUseCase.execute({
                contactId: user.contacts[0].toHexString(),
                activity: req.activity,
                color: undefined as any,
                description: req.description,
                email: user.emailInfo || user.email,
                phone: user.phoneInfo || user.phone,
                fb: req.fb,
                firstName: req.firstName,
                insta: req.insta,
                lastName: req.lastName,
                pictureFile: req.pictureFile,
                vk: req.vk,
                website: req.website,
                tipsMessage: undefined as any,
                pictureMediaId: req.pictureMediaId
            });
        }

        return Result.ok({userId: userId!});
    }
}