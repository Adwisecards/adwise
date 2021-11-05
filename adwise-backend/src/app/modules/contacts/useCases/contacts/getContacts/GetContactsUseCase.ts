import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { GetContactsDTO } from "./GetContactsDTO";
import { getContactsErrors } from "./getContactsErrors";

export class GetContactsUseCase implements IUseCase<GetContactsDTO.Request, GetContactsDTO.Response> {
    private contactRepo: IContactRepo;
    public errors: UseCaseError[] = [
        ...getContactsErrors
    ];
    constructor(contactRepo: IContactRepo) {
        this.contactRepo = contactRepo;
    }

    public async execute(req: GetContactsDTO.Request): Promise<GetContactsDTO.Response> {

        req.contacts = req.contacts.filter(c => c.phone.length >= 9);

        const contactsFound = await this.contactRepo.findByPhonesOrEmails(req.contacts);
        if (contactsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding contacts'));
        }

        const contacts = contactsFound.getValue()!;

        const mappedContacts: any[] = [];
        contacts.forEach((c) => {
            const phoneContact = req.contacts.find(pc => {
                const regex = new RegExp('.*'+pc.phone.slice(2)+'$');
                return regex.test(c.phone.value);
            });
            if (phoneContact) {
                const nc = {...c.toObject()};
                nc.phoneContactId = phoneContact!.id;
                mappedContacts.push(nc);
            }
        });


        return Result.ok({contacts: mappedContacts});
    }
}