import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { GetRefTreeOfOrganizationController } from "./GetRefTreeOfOrganizationController";
import { GetRefTreeOfOrganizationUseCase } from "./GetRefTreeOfOrganizationUseCase";

const getRefTreeOfOrganizationUseCase = new GetRefTreeOfOrganizationUseCase(organizationRepo, subscriptionRepo);
const getRefTreeOfOrganizationController = new GetRefTreeOfOrganizationController(getRefTreeOfOrganizationUseCase);

export {
    getRefTreeOfOrganizationUseCase,
    getRefTreeOfOrganizationController
};