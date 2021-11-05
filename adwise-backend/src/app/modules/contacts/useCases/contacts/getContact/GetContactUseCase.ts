import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { GetContactDTO } from "./GetContactDTO";
import { getContactErrors } from "./getContactErrors";

export class GetContactUseCase implements IUseCase<GetContactDTO.Request, GetContactDTO.Response> {
    private contactRepo: IContactRepo;
    public errors: UseCaseError[] = [
        ...getContactErrors
    ];
    constructor(contactRepo: IContactRepo) {
        this.contactRepo = contactRepo;
    }

    public async execute(req: GetContactDTO.Request): Promise<GetContactDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId)) {
            return Result.fail(UseCaseError.create('c', 'contactId is not valid'));
        }

        const contactFound = await this.contactRepo.findById(req.contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding contact') : UseCaseError.create('w'));
        }

        let contact = contactFound.getValue()!;
        if (contact.type == 'work') {
            contact = await contact.populate('organization employee', 'picture mainPicture name description briefDescription role').execPopulate();
        }
        return Result.ok({contact: contact});
    }
}