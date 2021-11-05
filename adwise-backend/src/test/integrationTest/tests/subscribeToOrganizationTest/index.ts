import { contactRepo } from "../../../../app/modules/contacts/repo/contacts";
import { subscriptionRepo } from "../../../../app/modules/finance/repo/subscriptions";
import { clientRepo } from "../../../../app/modules/organizations/repo/clients";
import { organizationRepo } from "../../../../app/modules/organizations/repo/organizations";
import { subscribeToOrganizationUseCase } from "../../../../app/modules/organizations/useCases/organizations/subscribeToOrganization";
import { SubscribeToOrganizationTest } from "./SubscribeToOrganizationTest";

export const subscribeToOrganizationTest = new SubscribeToOrganizationTest(
    clientRepo,
    contactRepo,
    organizationRepo,
    subscriptionRepo,
    subscribeToOrganizationUseCase
);