import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationService } from "../../../../../services/notificationService/INotificationService";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { CreateInvitationUseCase } from "../../../../organizations/useCases/invitations/createInvitation/CreateInvitationUseCase";
import { SubscribeToOrganizationUseCase } from "../../../../organizations/useCases/organizations/subscribeToOrganization/SubscribeToOrganizationUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { CreateUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification/CreateUserNotificationUseCase";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { IRequestRepo } from "../../../repo/requests/IRequestRepo";
import { AcceptRequestDTO } from "./AcceptRequestDTO";
import { acceptRequestErrors } from "./acceptRequestErrors";

export class AcceptRequestUseCase implements IUseCase<AcceptRequestDTO.Request, AcceptRequestDTO.Response> {
    private requestRepo: IRequestRepo;
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private subscribeToOrganizationUseCase: SubscribeToOrganizationUseCase;
    private createInvitationUseCase: CreateInvitationUseCase;
    private eventListenerService: IEventListenerService;
    private sendNotificationUseCase: SendNotificationUseCase;
    private createUserNotificationUseCase: CreateUserNotificationUseCase;

    public errors = acceptRequestErrors;

    constructor(
        requestRepo: IRequestRepo, 
        userRepo: IUserRepo, 
        contactRepo: IContactRepo, 
        subscribeToOrganizationUseCase: SubscribeToOrganizationUseCase, 
        createInvitationUseCase: CreateInvitationUseCase, 
        eventListenerService: IEventListenerService,
        sendNotificationUseCase: SendNotificationUseCase,
        createUserNotificationUseCase: CreateUserNotificationUseCase
    ) {
        this.contactRepo = contactRepo;
        this.requestRepo = requestRepo;
        this.userRepo = userRepo;
        this.subscribeToOrganizationUseCase = subscribeToOrganizationUseCase;
        this.createInvitationUseCase = createInvitationUseCase;
        this.eventListenerService = eventListenerService;
        this.sendNotificationUseCase = sendNotificationUseCase;
        this.createUserNotificationUseCase = createUserNotificationUseCase;
    }

    public async execute(req: AcceptRequestDTO.Request): Promise<AcceptRequestDTO.Response> {
        if (!Types.ObjectId.isValid(req.requestId)) {
            return Result.fail(UseCaseError.create('c', 'requestId is not valid'));
        }

        const requestFound = await this.requestRepo.findById(req.requestId);
        if (requestFound.isFailure) {
            return Result.fail(requestFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding request') : UseCaseError.create('b'));
        }

        const request = requestFound.getValue()!;

        const requestedContactFound = await this.contactRepo.findById(request.to.toHexString());
        if (requestedContactFound.isFailure) {
            return Result.fail(requestedContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding requested contact') : UseCaseError.create('c'));
        }

        const requestedContact = requestedContactFound.getValue()!;

        const requesterContactFound = await this.contactRepo.findById(request.from.toHexString());
        if (requesterContactFound.isFailure) {
            return Result.fail(requesterContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding requester contact') : UseCaseError.create('c'));
        }

        const requesterContact = requesterContactFound.getValue()!;

        const userFound = await this.userRepo.findById(requestedContact.ref.toHexString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const requestIndex = user.requests.findIndex(r => r.toHexString() == request._id);
        if (requestIndex >= 0) {
            user.requests.splice(requestIndex, 1);
        }
        
        requestedContact.contacts.push(requesterContact._id);
        requesterContact.contacts.push(requestedContact._id);

        if (requestedContact.organization) {
            const invitationCreated = await this.createInvitationUseCase.execute({
                couponId: undefined as any,
                organizationId: requestedContact.organization.toHexString(),
                userId: requestedContact.ref.toHexString(),
                invitationType: 'employee'
            });
            if (invitationCreated.isSuccess) {
                const {invitation} = invitationCreated.getValue()!
                await this.subscribeToOrganizationUseCase.execute({
                    contactId: requesterContact._id,
                    organizationId: requestedContact.organization.toHexString(),
                    userId: requesterContact.ref.toHexString(),
                    invitationId: invitation._id,
                    followingUserId: undefined as any
                });
            }
        }

        await this.contactRepo.save(requestedContact);
        await this.contactRepo.save(requesterContact);
        await this.userRepo.save(user);
        await this.requestRepo.deleteById(req.requestId);

        await this.sendNotificationUseCase.execute({
            type: 'contactRequestAccepted',
            values: {
                name: `${requestedContact.firstName.value}${requestedContact.lastName.value ? ' '+requestedContact.lastName.value : ''}`
            },
            data: {
                requestedContactId: requestedContact._id,
                requestId: request._id
            },
            receiverIds: [user._id.toString()]
        });

        await this.createUserNotificationUseCase.execute({
            contactId: requesterContact._id.toString(),
            level: 'info',
            type: 'contactRequestAccepted',
            userId: user._id.toString()
        });

        this.eventListenerService.dispatchEvent({
            id: user._id.toString(),
            subject: requestedContact._id.toString(),
            type: 'contactRequest'
        });

        this.eventListenerService.dispatchEvent({
            id: requesterContact.ref.toString(),
            subject: requesterContact._id.toString(),
            type: 'contactRequest'
        });


        return Result.ok({requestId: req.requestId});
    }
}