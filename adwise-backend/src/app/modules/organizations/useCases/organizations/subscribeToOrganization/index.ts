import { contactRepo } from "../../../../contacts/repo/contacts";
import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { createSubscriptionUseCase } from "../../../../finance/useCases/subscriptions/createSubscription";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { userRepo } from "../../../../users/repo/users";
import { clientRepo } from "../../../repo/clients";
import { couponRepo } from "../../../repo/coupons";
import { invitationRepo } from "../../../repo/invitations";
import { organizationRepo } from "../../../repo/organizations";
import { addCouponToContactUseCase } from "../../coupons/addCouponToContact";
import { getUserFavoriteOrganizationsUseCase } from "../../favoriteOrganizationLists/getUserFavoriteOrganizations";
import { createInvitationUseCase } from "../../invitations/createInvitation";
import { SubscribeToOrganizationController } from "./SubscribeToOrganizationController";
import { SubscribeToOrganizationUseCase } from "./SubscribeToOrganizationUseCase";

const subscribeToOrganizationUseCase = new SubscribeToOrganizationUseCase(
    organizationRepo, 
    contactRepo, 
    createSubscriptionUseCase, 
    invitationRepo, 
    couponRepo, 
    addCouponToContactUseCase, 
    clientRepo, 
    createInvitationUseCase, 
    userRepo,
    eventListenerService,
    subscriptionRepo,
    getUserFavoriteOrganizationsUseCase
);

const subscribeToOrganizationController = new SubscribeToOrganizationController(subscribeToOrganizationUseCase);

export {
    subscribeToOrganizationUseCase,
    subscribeToOrganizationController
};