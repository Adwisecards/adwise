import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { contactValidationService } from "../../../services/contactValidationService";
import { IContactValidationService } from "../../../services/contactValidationService/IContactValidationService";
import { FindContactsDTO } from "./FindContactsDTO";
import { findContactsErrors } from "./findContactsErrors";

export class FindContactsUseCase implements IUseCase<FindContactsDTO.Request, FindContactsDTO.Response> {
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private contactValidationService: IContactValidationService;

    public errors = [
        ...findContactsErrors
    ];

    constructor(userRepo: IUserRepo, contactRepo: IContactRepo, contactValidationService: IContactValidationService) {
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.contactValidationService = contactValidationService;
    }

    public async execute(req: FindContactsDTO.Request): Promise<FindContactsDTO.Response> {
        const valid = await this.contactValidationService.findContactsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;
        
        const userContactIds = user.contacts;

        const contacts: FindContactsDTO.IContactSearchResult[] = [];
        for (const userContactId of userContactIds) {
            const contactsFound = await this.contactRepo.findByContact(userContactId.toHexString(), req.limit, req.page);
            if (contactsFound.isSuccess) {
                contacts.push({
                    contact: userContactId.toHexString(),
                    items: contactsFound.getValue()!
                });
            }
        }

        return Result.ok({contacts});
    }
}