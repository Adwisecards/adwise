import { Types } from "mongoose";
import MyRegexp from "myregexp";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IContact, IContactModel } from "../../../models/Contact";
import { IContactRepo } from "../IContactRepo";

export class ContactRepo extends Repo<IContact, IContactModel> implements IContactRepo {
    public async findContactsOfContact(contact: string) {
        try {
            const contacts = await this.Model.find({
                contacts: {$in: [new Types.ObjectId(contact)]}
            });

            return Result.ok(contacts);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByPhonesOrEmails(phoneEmails: {phone: string; email: string;}[]) {
        try {
            const phones = phoneEmails.filter(o => MyRegexp.phone().test(o.phone)).map(o => new RegExp('.*'+o.phone.slice(2)+'$'));
            const emails = phoneEmails.map(o => o.email);
            const contacts = await this.Model.find({
                $or: [{'phone.value': {$in: phones}}, {'email.value': {$in: emails}}]
            });

            return Result.ok(contacts);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findBySubscription(organizationId: string, limit: number, page: number) {
        try {
            const contacts = await this.Model.find({
                subscriptions: {$in: [new Types.ObjectId(organizationId)]}
            })
            .limit(limit)
            .skip(limit * (page - 1));

            return Result.ok(contacts);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByContact(contactId: string, limit: number, page: number) {
        try {
            const contacts = await this.Model.find({
                contacts: {$in: [new Types.ObjectId(contactId)]}
            })
            .limit(limit)
            .skip(limit * (page - 1));

            return Result.ok(contacts);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByUserAndType(userId: string, type: string) {
        try {
            const contacts = await this.Model.find({ref: userId, type: type}).populate('employee organization ref contacts');

            return Result.ok(contacts);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
};