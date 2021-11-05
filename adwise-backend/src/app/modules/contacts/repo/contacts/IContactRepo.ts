import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IContact } from "../../models/Contact";

export interface IContactRepo extends IRepo<IContact> {
    findContactsOfContact(id: string): RepoResult<IContact[]>;
    findByPhonesOrEmails(phoneEmails: {phone: string; email: string;}[]): RepoResult<IContact[]>;
    findBySubscription(organizationId: string, limit: number, page: number): RepoResult<IContact[]>;
    findByContact(contactId: string, limit: number, page: number): RepoResult<IContact[]>;
    findByUserAndType(userId: string, type: string): RepoResult<IContact[]>;
};