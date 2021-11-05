import { contactRepo } from "../../../../contacts/repo/contacts";
import { clientRepo } from "../../../repo/clients";
import { organizationStatisticsService } from "../../../services/organizations/organizationStatisticsService";
import { GetOrganizationClientController } from "./GetOrganizationClientController";
import { GetOrganizationClientUseCase } from "./GetOrganizationClientUseCase";

const getOrganizationClientUseCase = new GetOrganizationClientUseCase(clientRepo, organizationStatisticsService);
const getOrganizationClientController = new GetOrganizationClientController(getOrganizationClientUseCase);

export {
    getOrganizationClientUseCase,
    getOrganizationClientController
};