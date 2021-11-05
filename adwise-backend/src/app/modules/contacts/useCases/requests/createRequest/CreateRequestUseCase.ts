import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationService } from "../../../../../services/notificationService/INotificationService";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IRequest, RequestModel } from "../../../models/Request";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { IRequestRepo } from "../../../repo/requests/IRequestRepo";
import { AcceptRequestUseCase } from "../acceptRequest/AcceptRequestUseCase";
import { CreateRequestDTO } from "./CreateRequestDTO";
import { createRequestErrors } from "./createRequestErrors";

export class CreateRequestUseCase implements IUseCase<CreateRequestDTO.Request, CreateRequestDTO.Response> {
    private requestRepo: IRequestRepo;
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private acceptRequestUseCase: AcceptRequestUseCase;
    private sendNotificationUseCase: SendNotificationUseCase;

    public errors: UseCaseError[] = [
        ...createRequestErrors
    ];

    constructor(
        requestRepo: IRequestRepo, 
        userRepo: IUserRepo, 
        contactRepo: IContactRepo, 
        acceptRequestUseCase: AcceptRequestUseCase,
        sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.requestRepo = requestRepo;
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.acceptRequestUseCase = acceptRequestUseCase;
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    public async execute(req: CreateRequestDTO.Request): Promise<CreateRequestDTO.Response> {
        if (!Types.ObjectId.isValid(req.from) || !Types.ObjectId.isValid(req.to)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const request = new RequestModel({
            from: req.from,
            to: req.to
        });

        const contactFound = await this.contactRepo.findById(req.to);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const contact = contactFound.getValue()!;
        if (contact.contacts.findIndex(c => c.toHexString() == req.from) >= 0) {
            return Result.fail(UseCaseError.create('c', 'Contact has already requested'));
        }

        const requesterContactFound = await this.contactRepo.findById(req.from);
        if (requesterContactFound.isFailure) {
            return Result.fail(requesterContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding requester contact') : UseCaseError.create('b'));
        }

        const requesterContact = requesterContactFound.getValue()!;
        console.log(contact);
        const userFound = await this.userRepo.findById(contact.ref.toHexString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = await userFound.getValue()!.populate('requests').execPopulate();
        if (requesterContact.ref == contact.ref || !!contact.contacts.find(c => c.toHexString() == requesterContact._id) || req.from == req.to) {
            return Result.fail(UseCaseError.create('c'));
        }

        if ((<IRequest[]>(<any>user.requests)).find(r => r.from.toHexString() == req.from && r.to.toHexString() == req.to)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const requestSaved = await this.requestRepo.save(request);
        if (requestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving request'));
        }

        user.requests.push(request._id);
        // user.logs.unshift({
        //     ref: request._id,
        //     type: 'contactRequestCreated',
        //     timestamp: new Date()
        // });

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        await this.acceptRequestUseCase.execute({
            requestId: request._id
        });

        await this.sendNotificationUseCase.execute({
            receiverIds: [user._id.toString()],
            type: 'contactRequestCreated',
            data: {
                requesterContactId: requesterContact._id,
                requestedContactId: contact._id,
                requestId: request._id
            },
            values: {
                name: `${requesterContact.firstName.value}${requesterContact.lastName.value ? ' '+requesterContact.lastName.value : ''}`
            }
        });

        return Result.ok({requestId: request._id});
    }
}