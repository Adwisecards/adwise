import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { ISubscription } from "../../../../finance/models/Subscription";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { DeleteSubscriptionUseCase } from "../../../../finance/useCases/subscriptions/deleteSubscription/DeleteSubscriptionUseCase";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IClient } from "../../../models/Client";
import { IOrganization } from "../../../models/Organization";
import { IClientRepo } from "../../../repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { RemoveOrganizationFromUserFavoriteListUseCase } from "../../favoriteOrganizationLists/removeOrganizationFromUserFavoriteList/RemoveOrganizationFromUserFavoriteListUseCase";
import { UnsubscribeFromOrganizationDTO } from "./UnsubscribeFromOrganizationDTO";
import { unsubscribeFromOrganizationErrors } from "./unsubscribeFromOrganizationErrors";

interface IKeyObjects {
    contact: IContact;
    user: IUser;
    organization: IOrganization;
    client: IClient | undefined;
    subscription: ISubscription | undefined;
};

export class UnsubscribeFromOrganizationUseCase implements IUseCase<UnsubscribeFromOrganizationDTO.Request, UnsubscribeFromOrganizationDTO.Response> {
    private contactRepo: IContactRepo;
    private organizationRepo: IOrganizationRepo;
    private deleteSubscriptionUseCase: DeleteSubscriptionUseCase;
    private userRepo: IUserRepo;
    private clientRepo: IClientRepo;
    private eventListenerService: IEventListenerService;
    private subscriptionRepo: ISubscriptionRepo;
    private removeOrganizationFromUserFavoriteListUseCase: RemoveOrganizationFromUserFavoriteListUseCase;

    public errors: UseCaseError[] = [
        ...unsubscribeFromOrganizationErrors
    ];

    constructor(
        contactRepo: IContactRepo, 
        organizationRepo: IOrganizationRepo, 
        deleteSubscriptionUseCase: DeleteSubscriptionUseCase, 
        clientRepo: IClientRepo, 
        userRepo: IUserRepo,
        eventListenerService: IEventListenerService,
        subscriptionRepo: ISubscriptionRepo,
        removeOrganizationFromUserFavoriteListUseCase: RemoveOrganizationFromUserFavoriteListUseCase
    ) {
        this.contactRepo = contactRepo;
        this.organizationRepo = organizationRepo;
        this.deleteSubscriptionUseCase = deleteSubscriptionUseCase;
        this.clientRepo = clientRepo;
        this.userRepo = userRepo;
        this.eventListenerService = eventListenerService;
        this.subscriptionRepo = subscriptionRepo;
        this.removeOrganizationFromUserFavoriteListUseCase = removeOrganizationFromUserFavoriteListUseCase;
    }

    public async execute(req: UnsubscribeFromOrganizationDTO.Request): Promise<UnsubscribeFromOrganizationDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId) || !Types.ObjectId.isValid(req.organizationId) || !Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId, req.userId, req.contactId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            client,
            contact,
            organization,
            subscription,
            user
        } = keyObjectsGotten.getValue()!;

        let subscriptionIndex = contact.subscriptions.findIndex(i => i.toHexString() == organization._id.toString());
        
        if (subscriptionIndex != -1) {
            contact.subscriptions.splice(subscriptionIndex, 1);
        }

        let clientIndex = organization.clients.findIndex(i => i.toHexString() == contact._id.toString());

        if (clientIndex != -1) {
            organization.clients.splice(clientIndex, 1);
        }

        if (client) {
            client.disabled = true;

            const clientSaved = await this.clientRepo.save(client);
            if (clientSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving client'));
            }
        }

        if (subscription) {
            const subscriptionDeleted = await this.deleteSubscriptionUseCase.execute({
                organizationId: req.organizationId,
                userId: req.userId
            });

            if (subscriptionDeleted.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon deleting subscription'));
            }
        }

        const contactSaved = await this.contactRepo.save(contact);
        if (contactSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving contact'));
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        this.eventListenerService.dispatchEvent({
            id: user._id.toString(),
            subject: organization._id,
            type: 'unsubscribedFromOrganization'
        });

        await this.removeOrganizationFromUserFavoriteListUseCase.execute({
            organizationId: organization._id.toString(),
            userId: user._id.toString()
        });

        return Result.ok({
            organizationId: organization._id
        });
    }

    private async getKeyObjects(organizationId: string, userId: string, contactId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const contactFound = await this.contactRepo.findById(contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding contact') : UseCaseError.create('w'));
        }

        const contact = contactFound.getValue()!;

        let subscription: ISubscription | undefined;

        const subscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(userId, organizationId);
        if (subscriptionFound.isSuccess) {
            subscription = subscriptionFound.getValue()!;
        }

        let client: IClient | undefined;

        const clientFound = await this.clientRepo.findByOrganizationAndUser(organizationId, userId);
        if (clientFound.isSuccess) {
            client = clientFound.getValue()!;
        }

        return Result.ok({
            client,
            contact,
            organization,
            subscription,
            user
        });
    }
}

