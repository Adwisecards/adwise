import { contactRepo } from "../../../../contacts/repo/contacts";
import { organizationRepo } from "../../../repo/organizations";
import { UnsubscribeFromOrganizationUseCase } from "./UnsubscribeFromOrganizationUseCase";
import {UnsubscribeFromOrganizationController} from './UnsubscribeFromOrganizationController';
import { deleteSubscriptionUseCase } from "../../../../finance/useCases/subscriptions/deleteSubscription";
import { clientRepo } from "../../../repo/clients";
import { userRepo } from "../../../../users/repo/users";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { removeOrganizationFromUserFavoriteListUseCase } from "../../favoriteOrganizationLists/removeOrganizationFromUserFavoriteList";

const unsubscribeFromOrganizationUseCase = new UnsubscribeFromOrganizationUseCase(
    contactRepo, 
    organizationRepo, 
    deleteSubscriptionUseCase, 
    clientRepo, 
    userRepo,
    eventListenerService,
    subscriptionRepo,
    removeOrganizationFromUserFavoriteListUseCase
);

const unsubscribeFromOrganizationController = new UnsubscribeFromOrganizationController(unsubscribeFromOrganizationUseCase);

export {
    unsubscribeFromOrganizationController,
    unsubscribeFromOrganizationUseCase
};