import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ContactModel } from "../../../models/Contact";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { IContactValidationService } from "../../../services/contactValidationService/IContactValidationService";
import { CreateContactDTO } from "./CreateContactDTO";
import { createContactErrors } from "./createContactErrors";

export class CreateContactUseCase implements IUseCase<CreateContactDTO.Request, CreateContactDTO.Response> {
    public errors: UseCaseError[] = [
        ...createContactErrors
    ];
    private contactValidationService: IContactValidationService;
    private contactRepo: IContactRepo;
    private userRepo: IUserRepo;
    private mediaService: IMediaService;
    private createRefUseCase: CreateRefUseCase;

    constructor(
        contactValidationService: IContactValidationService, 
        contactRepo: IContactRepo, 
        userRepo: IUserRepo, 
        mediaService: IMediaService, 
        createRefUseCase: CreateRefUseCase
    ) {
        this.contactValidationService = contactValidationService;
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.mediaService = mediaService;
        this.createRefUseCase = createRefUseCase;
    }

    public async execute(req: CreateContactDTO.Request): Promise<CreateContactDTO.Response> {
        const valid = this.contactValidationService.createContactData<CreateContactDTO.Request>(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let pictureUrl;
        if (req.pictureFile) {
            const pictureSaved = await this.mediaService.save(req.pictureFile.filename, req.pictureFile.data);
            if (pictureSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving picture'));
            }

            pictureUrl = pictureSaved.getValue()!;
        }

        req.picture = pictureUrl;
        
        const contact = new ContactModel({
            firstName: {
                value: req.firstName || user.firstName,
                custom: !!req.firstName
            },
            lastName: {
                value: req.lastName || user.lastName,
                custom: !!req.lastName
            },
            description: {
                value: req.description || user.description,
                custom: !!req.description
            },
            phone: {
                value: req.phone || user.phone,
                custom: !!req.phone
            },
            email: {
                value: req.email || user.email,
                custom: !!req.email
            },
            activity: {
                value: req.activity || user.activity,
                custom: !!req.activity
            },
            socialNetworks: {
                insta: {
                    value: req.insta || user.socialNetworks.insta,
                    custom: !!req.insta
                },
                fb: {
                    value: req.fb || user.socialNetworks.fb,
                    custom: !!req.fb
                },
                vk: {
                    value: req.vk || user.socialNetworks.vk,
                    custom: !!req.vk
                },
            },
            type: req.type,
            ref: req.userId,
            website: {
                value: req.website || user.website,
                custom: !!req.website
            },
            color: req.color || undefined as any,
            picture: {
                value: req.picture || user.picture,
                custom: !!req.picture
            },
            pictureMedia: req.pictureMediaId
        });

        const refCreated = await this.createRefUseCase.execute({
            ref: contact._id,
            mode: 'contact',
            type: req.type
        });

        if (refCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        contact.requestRef = ref;

        const contactSaved = await this.contactRepo.save(contact);
        if (contactSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving contact'));
        }

        user.contacts.push(contact._id);
        
        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            await this.contactRepo.deleteById(contact._id);
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({
            contactId: contact._id
        });
    }
}