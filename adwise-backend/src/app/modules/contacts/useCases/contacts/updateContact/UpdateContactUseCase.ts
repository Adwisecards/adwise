import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { IContactValidationService } from "../../../services/contactValidationService/IContactValidationService";
import { UpdateContactDTO } from "./UpdateContactDTO";
import { updateContactErrors } from "./updateContactErrors";

export class UpdateContactUseCase implements IUseCase<UpdateContactDTO.Request, UpdateContactDTO.Response> {
    private contactRepo: IContactRepo;
    private contactValidationService: IContactValidationService;
    private mediaService: IMediaService;

    public errors = updateContactErrors;

    constructor(contactRepo: IContactRepo, contactValidationService: IContactValidationService, mediaService: IMediaService) {
        this.contactRepo = contactRepo;
        this.contactValidationService = contactValidationService;
        this.mediaService = mediaService;
    }

    public async execute(req: UpdateContactDTO.Request): Promise<UpdateContactDTO.Response> {
        const {contactId} = req; delete req.contactId;
        const valid = this.contactValidationService.updateContactData(req);
        if (!Types.ObjectId.isValid(contactId!)) {
            return Result.fail(UseCaseError.create('c', 'Contact ID must be valid'));
        }

        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const contactFound = await this.contactRepo.findById(contactId!);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding contact') : UseCaseError.create('w'));
        }

        let pictureUrl;
        if (req.pictureFile) {
            const pictureSaved = await this.mediaService.save(req.pictureFile.filename, req.pictureFile.data);
            if (pictureSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding picture'));
            }

            pictureUrl = pictureSaved.getValue()!;
        }

        req.picture = pictureUrl;

        const contact = contactFound.getValue()!;
        try {
            for (const key in req) {
                if (!(<any>req)[key] && (<any>req)[key] != '') continue;
                if (key == 'color') {
                    contact.color = req.color;
                    continue;
                }
                
                if (key == 'tipsMessage') {
                    contact.tipsMessage = req.tipsMessage;
                    continue;
                }

                if (key == 'pictureMediaId') {
                    contact.pictureMedia = req.pictureMediaId || contact.pictureMedia as any;
                    continue;
                }

                if (key == 'fb') {
                    contact.socialNetworks.fb.value = req.fb;
                    contact.socialNetworks.fb.custom = true;
                    continue;
                }
                if (key == 'insta') {
                    contact.socialNetworks.insta.value = req.insta;
                    contact.socialNetworks.insta.custom = true;
                    continue;
                }
                if (key == 'vk') {
                    contact.socialNetworks.vk.value = req.vk;
                    contact.socialNetworks.vk.custom = true;
                    continue;
                }
                if ((<any>contact)[key] || (<any>req)[key] == '') {
                    (<any>contact)[key].value = (<any>req)[key] || (<any>contact)[key].value;
                    (<any>contact)[key].custom = true;
                }
            }
        } catch (ex) {
            console.log(ex);
        }
        

        const contactSaved = await this.contactRepo.save(contact);
        if (contactSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving contact'));
        }

        return Result.ok({contactId: contactId!});
    }
}