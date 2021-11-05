import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { IRequestRepo } from "../../../repo/requests/IRequestRepo";
import { CancelRequestUseCase } from "../../requests/cancelRequest/CancelRequestUseCase";
import { DeleteContactDTO } from "./DeleteContactDTO";
import { deleteContactErrors } from "./deleteContactErrors";

export class DeleteContactUseCase implements IUseCase<DeleteContactDTO.Request, DeleteContactDTO.Response> {
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private requestRepo: IRequestRepo;
    private cancelRequestUseCase: CancelRequestUseCase;
    public errors: UseCaseError[] = [
        ...deleteContactErrors
    ];
    constructor(userRepo: IUserRepo, contactRepo: IContactRepo, requestRepo: IRequestRepo, cancelRequestUseCase: CancelRequestUseCase) {
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.requestRepo = requestRepo;
        this.cancelRequestUseCase = cancelRequestUseCase;
    }

    public async execute(req: DeleteContactDTO.Request): Promise<DeleteContactDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const contactFound = await this.contactRepo.findById(req.contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const contact = contactFound.getValue()!;

        const requestsFound = await this.requestRepo.findRequestsByContact(contact._id);
        if (requestsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding requests'));
        }

        const requests = requestsFound.getValue()!;
        
        for (const request of requests) {
            await this.cancelRequestUseCase.execute({
                requestId: request.id
            });
        }

        const userFound = await this.userRepo.findById(contact.ref.toHexString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const contactIndex = user.contacts.findIndex(c => c.toHexString() == contact._id);
        if (contactIndex >= 0) {
            user.contacts.splice(contactIndex, 1);
        }

        const contactsFound = await this.contactRepo.findContactsOfContact(req.contactId);
        if (contactsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding contacts'));
        }

        const contacts = contactsFound.getValue()!;
        for (const contact of contacts) {
            const contactIndex = contact.contacts.findIndex(c => c.toHexString() == req.contactId);
            if (contactIndex >= 0) {
                contact.contacts.splice(contactIndex, 1);
                await this.contactRepo.save(contact);
            }
        }

        const contactDeleted = await this.contactRepo.deleteById(req.contactId);
        if (contactDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting contact'));
        }

        const userSaved = await this.userRepo.save(user._id);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({contactId: contact._id});
    }
}