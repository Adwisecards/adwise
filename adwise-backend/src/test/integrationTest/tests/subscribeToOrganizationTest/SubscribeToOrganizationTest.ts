import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IContact } from "../../../../app/modules/contacts/models/Contact";
import { IContactRepo } from "../../../../app/modules/contacts/repo/contacts/IContactRepo";
import { ISubscription } from "../../../../app/modules/finance/models/Subscription";
import { ISubscriptionRepo } from "../../../../app/modules/finance/repo/subscriptions/ISubscriptionRepo";
import { IClient } from "../../../../app/modules/organizations/models/Client";
import { IOrganization } from "../../../../app/modules/organizations/models/Organization";
import { IClientRepo } from "../../../../app/modules/organizations/repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../../app/modules/organizations/repo/organizations/IOrganizationRepo";
import { SubscribeToOrganizationDTO } from "../../../../app/modules/organizations/useCases/organizations/subscribeToOrganization/SubscribeToOrganizationDTO";
import { SubscribeToOrganizationUseCase } from "../../../../app/modules/organizations/useCases/organizations/subscribeToOrganization/SubscribeToOrganizationUseCase";
import { IUser } from "../../../../app/modules/users/models/User";

interface ISubscribeToOrganizationObjects {
    clientUserContact: IContact;
    clientUserSubscription: ISubscription;
    clientUserClient: IClient;
    organization: IOrganization;
};

export class SubscribeToOrganizationTest {
    private clientRepo: IClientRepo;
    private contactRepo: IContactRepo;
    private organizationRepo: IOrganizationRepo;
    private subscriptionRepo: ISubscriptionRepo;
    private subscribeToOrganizationUseCase: SubscribeToOrganizationUseCase;

    constructor(
        clientRepo: IClientRepo,
        contactRepo: IContactRepo,
        organizationRepo: IOrganizationRepo,
        subscriptionRepo: ISubscriptionRepo,
        subscribeToOrganizationUseCase: SubscribeToOrganizationUseCase
    ) {
        this.clientRepo = clientRepo;
        this.contactRepo = contactRepo;
        this.organizationRepo = organizationRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.subscribeToOrganizationUseCase = subscribeToOrganizationUseCase;
    }

    public async execute(organization: IOrganization, clientUser: IUser): Promise<Result<ISubscribeToOrganizationObjects | null, UseCaseError | null>> {        
        const subscribeToOrganizationData: SubscribeToOrganizationDTO.Request = {
            contactId: clientUser.contacts[0].toString(),
            userId: clientUser._id.toString(),
            organizationId: organization._id.toString(),
            followingUserId: undefined as any,
            invitationId: undefined as any
        };
        
        const subscribedToOrganization = await this.subscribeToOrganizationUseCase.execute(subscribeToOrganizationData);
        if (subscribedToOrganization.isFailure) {
            return Result.fail(subscribedToOrganization.getError());
        }

        const { organizationId } = subscribedToOrganization.getValue()!;

        const clientUserSubscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(clientUser._id.toString(), organization._id.toString());
        if (clientUserSubscriptionFound.isFailure) {
            return Result.fail(clientUserSubscriptionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding client user subscription') : UseCaseError.create('n', 'Client user subscription does not exist'));
        }

        const clientUserSubscription = clientUserSubscriptionFound.getValue()!;

        const clientUserClientFound = await this.clientRepo.findByOrganizationAndUser(organization._id.toString(), clientUser._id.toString());
        if (clientUserClientFound.isFailure) {
            return Result.fail(clientUserClientFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user client client') : UseCaseError.create('b', 'User client client does not exist'));
        }

        const clientUserClient = clientUserClientFound.getValue()!;

        const clientUserContactFound = await this.contactRepo.findById(clientUser.contacts[0].toString());
        if (clientUserContactFound.isFailure) {
            return Result.fail(clientUserContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding client user contact') : UseCaseError.create('w', 'Client user contact does not exist'));
        }

        const clientUserContact = clientUserContactFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l', 'Organization does not exist'));
        }

        organization = organizationFound.getValue()!;

        if (clientUserSubscription.level != 1) {
            return Result.fail(UseCaseError.create('c', 'Client subscription level is not correct'));
        }

        if (!organization.clients.length) {
            return Result.fail(UseCaseError.create('c', 'Organization does not have clients'));
        }

        if (!clientUserContact.subscriptions.length) {
            return Result.fail(UseCaseError.create('c', 'Client user contact does not exist'));
        }

        return Result.ok({clientUserClient, organization, clientUserSubscription, clientUserContact});
    }
}