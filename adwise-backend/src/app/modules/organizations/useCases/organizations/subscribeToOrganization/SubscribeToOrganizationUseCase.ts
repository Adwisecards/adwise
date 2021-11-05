import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { ISubscription } from "../../../../finance/models/Subscription";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { CreateSubscriptionUseCase } from "../../../../finance/useCases/subscriptions/createSubscription/CreateSubscriptionUseCase";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ClientModel, IClient } from "../../../models/Client";
import { ICoupon } from "../../../models/Coupon";
import { IFavoriteOrganizationList } from "../../../models/FavoriteOrganizationList";
import { IInvitation } from "../../../models/Invitation";
import { IOrganization } from "../../../models/Organization";
import { IClientRepo } from "../../../repo/clients/IClientRepo";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IFavoriteOrganizationListRepo } from "../../../repo/favoriteOrganizationLists/IFavoriteOrganizationListRepo";
import { IInvitationRepo } from "../../../repo/invitations/IInvitationRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { AddCouponToContactUseCase } from "../../coupons/addCouponToContact/AddCouponToContactUseCase";
import { GetUserFavoriteOrganizationsUseCase } from "../../favoriteOrganizationLists/getUserFavoriteOrganizations/GetUserFavoriteOrganizationsUseCase";
import { CreateInvitationUseCase } from "../../invitations/createInvitation/CreateInvitationUseCase";
import { SubscribeToOrganizationDTO } from "./SubscribeToOrganizationDTO";
import { subscribeToOrganizationErrors } from "./subscribeToOrganizationErrors";

interface IKeyObjects {
    user: IUser;
    contact: IContact;
    organization: IOrganization;
    subscription?: ISubscription;
    inviterSubscription?: ISubscription;
    client?: IClient;
    invitation?: IInvitation;
    coupon?: ICoupon;
    followingUser?: IUser;
    parentUser?: IUser;
};

export class SubscribeToOrganizationUseCase implements IUseCase<SubscribeToOrganizationDTO.Request, SubscribeToOrganizationDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private createSubscriptionUseCase: CreateSubscriptionUseCase;
    private invitationRepo: IInvitationRepo;
    private couponRepo: ICouponRepo;
    private addCouponToContactUseCase: AddCouponToContactUseCase;
    private clientRepo: IClientRepo;
    private createInvitationUseCase: CreateInvitationUseCase;
    private eventListenerService: IEventListenerService;
    private subscriptionRepo: ISubscriptionRepo;
    private getUserFavoriteOrganizationsUseCase: GetUserFavoriteOrganizationsUseCase;

    public errors: UseCaseError[] = [
        ...subscribeToOrganizationErrors
    ];

    constructor(
        organizationRepo: IOrganizationRepo, 
        contactRepo: IContactRepo, 
        createSubscriptionUseCase: CreateSubscriptionUseCase, 
        invitationRepo: IInvitationRepo, 
        couponRepo: ICouponRepo, 
        addCouponToContactUseCase: AddCouponToContactUseCase, 
        clientRepo: IClientRepo, 
        createInvitationUseCase: CreateInvitationUseCase,
        userRepo: IUserRepo,
        eventListenerService: IEventListenerService,
        subscriptionRepo: ISubscriptionRepo,
        getUserFavoriteOrganizationsUseCase: GetUserFavoriteOrganizationsUseCase
    ) {
        //this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.organizationRepo = organizationRepo;
        this.createSubscriptionUseCase = createSubscriptionUseCase;
        this.invitationRepo = invitationRepo;
        this.couponRepo = couponRepo;
        this.addCouponToContactUseCase = addCouponToContactUseCase;
        this.clientRepo = clientRepo;
        this.createInvitationUseCase = createInvitationUseCase;
        this.userRepo = userRepo;
        this.eventListenerService = eventListenerService;
        this.subscriptionRepo = subscriptionRepo;
        this.getUserFavoriteOrganizationsUseCase = getUserFavoriteOrganizationsUseCase;
    }

    public async execute(req: SubscribeToOrganizationDTO.Request): Promise<SubscribeToOrganizationDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId) || !Types.ObjectId.isValid(req.organizationId) || !Types.ObjectId.isValid(req.userId) || (req.invitationId && !Types.ObjectId.isValid(req.invitationId))) {
            return Result.fail(UseCaseError.create('c'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.followingUserId, req.organizationId, req.contactId, req.invitationId, req.resolvedObjects);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        let {
            organization,
            user,
            client,
            coupon,
            followingUser,
            invitation,
            subscription,
            contact,
            parentUser
        } = keyObjectsGotten.getValue()!;

        if (organization.disabled) {
            return Result.fail(UseCaseError.create('c', 'Organization is disabled'));
        }

        const subscriptionIndex = contact.subscriptions.findIndex(i => i.toString() == organization._id.toString()); 

        if (subscriptionIndex == -1) {
            contact.subscriptions.push(organization._id);
        }

        const clientIndex = organization.clients.findIndex(i => i.toString() == contact._id.toString());

        if (clientIndex == -1) {
            organization.clients.push(contact._id);
        }

        if (!invitation && (followingUser || parentUser)) {
            const invitationCreated = await this.createInvitationUseCase.execute({
                couponId: undefined as any,
                organizationId: organization._id.toString(),
                userId: followingUser?._id.toString() || parentUser?._id.toString(),
                invitationType: followingUser ? 'following' : 'parent'
            });

            if (invitationCreated.isSuccess) {
                invitation = invitationCreated.getValue()!.invitation;
            }
        }

        if (coupon) {
            await this.addCouponToContactUseCase.execute({
                contactId: contact._id.toString(),
                couponId: coupon._id.toString()
            });
        }

        if (client) {
            client.disabled = false;
        } else {
            client = new ClientModel({
                contact: contact._id.toString(),
                organization: organization._id.toString(),
                user: user._id.toString(),
            });
        }


        // FAVORITE ORGANIZATIONS OF INVITER
        let inviterFavoriteOrganizations: IOrganization[] = [];

        if (invitation && !req.additionalSubscriptions) {
            const inviterSubscriptionFound = await this.subscriptionRepo.findById(invitation.subscription.toString());
            if (inviterSubscriptionFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding inviter subscription'));
            }

            const inviterSubscription = inviterSubscriptionFound.getValue()!;

            const favoriteOrganizationListFound = await this.getUserFavoriteOrganizationsUseCase.execute({
                userId: inviterSubscription.subscriber.toString()
            });

            if (favoriteOrganizationListFound.isFailure) {
                return Result.fail(UseCaseError.create('a', "Error upon getting inviter favorite organizations"));
            }

            inviterFavoriteOrganizations = favoriteOrganizationListFound.getValue()!.organizations.filter(o => o._id.toString() != req.organizationId);
        }

        const subscriptionCreated = await this.createSubscriptionUseCase.execute({
            organizationId: organization._id.toString(),
            invitation: invitation!,
            userId: user._id.toString()
        });

        if (subscriptionCreated.isFailure) {
            if (subscriptionCreated.getError()!.code != 'f') {
                return Result.fail(subscriptionCreated.getError());
            }
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const clientSaved = await this.clientRepo.save(client);
        if (clientSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon savuing client'));
        }

        const contactSaved = await this.contactRepo.save(contact);
        if (contactSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving contact'));
        }

        this.eventListenerService.dispatchEvent({
            id: user._id.toString(),
            subject: organization._id,
            type: 'subscribedToOrganization'
        });

        for (const organization of inviterFavoriteOrganizations) {
            const inviterSubscriptionFound = await this.subscriptionRepo.findById(invitation?.subscription.toString() || '');
            if (inviterSubscriptionFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding inviter subscription'));
            }

            const inviterSubscription = inviterSubscriptionFound.getValue()!;

            const favoriteOrganizationInvitationCreated = await this.createInvitationUseCase.execute({
                couponId: undefined as any,
                organizationId: organization._id.toString(),
                userId: inviterSubscription.subscriber.toString() as any,
                invitationType: invitation?.invitationType || 'invitation'
            });

            let favoriteOrganizationInvitation: IInvitation | undefined;

            if (favoriteOrganizationInvitationCreated.isSuccess) {
                favoriteOrganizationInvitation = favoriteOrganizationInvitationCreated.getValue()!.invitation;
            } else {
                console.log(favoriteOrganizationInvitationCreated.getError());
            }

            

            await this.execute({
                contactId: req.contactId,
                invitationId: undefined as any,
                organizationId: organization._id.toString(),
                userId: req.userId,
                followingUserId: invitation?.subscription.toString() as any,
                resolvedObjects: {
                    organization: organization,
                    user: user,
                    contact: contact,
                    invitation: favoriteOrganizationInvitation
                },
                additionalSubscriptions: true
            });
        }

        return Result.ok({
            organizationId: organization._id
        });
    }

    private async getKeyObjects(userId: string, followingUserId: string, organizationId: string, contactId: string, invitationId: string, resolvedObjects?: SubscribeToOrganizationDTO.Request['resolvedObjects']): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        let user: IUser;
        
        if (resolvedObjects?.user) {
            user = resolvedObjects.user;
        } else {
            const userFound = await this.userRepo.findById(userId);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        }

        let organization: IOrganization;

        if (resolvedObjects?.organization) {
            organization = resolvedObjects.organization;
        } else {
            const organizationFound = await this.organizationRepo.findById(organizationId);
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        }

        let contact: IContact;

        if (resolvedObjects?.contact) {
            contact = resolvedObjects.contact;
        } else {
            const contactFound = await this.contactRepo.findById(contactId);
            if (contactFound.isFailure) {
                return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding contact') : UseCaseError.create('w'));
            }

            contact = contactFound.getValue()!;
        }

        let invitation: IInvitation | undefined;

        if (resolvedObjects?.invitation) {
            invitation = resolvedObjects.invitation;
        } else if (invitationId) {
            const invitationFound = await this.invitationRepo.findById(invitationId);
            if (invitationFound.isSuccess) {
                invitation = invitationFound.getValue()!;
            }
        }

        let coupon: ICoupon | undefined;

        if (invitation?.coupon) {
            const couponFound = await this.couponRepo.findById(invitation.coupon.toString());
            if (couponFound.isSuccess) {
                coupon = couponFound.getValue()!;
            }
        }

        let followingUser: IUser | undefined;
        
        if (followingUserId) {
            const followingUserFound = await this.userRepo.findById(followingUserId);
            if (followingUserFound.isSuccess) {
                followingUser = followingUserFound.getValue()!;
            }
        }

        let client: IClient | undefined;

        const clientFound = await this.clientRepo.findByOrganizationAndUser(organizationId, userId);
        if (clientFound.isSuccess) {
            client = clientFound.getValue()!;
        }

        let subscription: ISubscription | undefined;

        const subscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(userId, organizationId);
        if (subscriptionFound.isSuccess) {
            subscription = subscriptionFound.getValue()!;
        }

        let parentUser: IUser | undefined;

        if (user.parent) {
            const parentUserFound = await this.userRepo.findById(user.parent.toString());
            if (parentUserFound.isSuccess) {
                parentUser = parentUserFound.getValue()!;
            }
        }

        return Result.ok({
            client,
            coupon,
            invitation,
            organization,
            subscription,
            user,
            followingUser,
            contact,
            parentUser
        });
    }
}