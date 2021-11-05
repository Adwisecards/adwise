import { GetOrganizationClientsUseCase } from "./GetOrganizationClientsUseCase";
import {GetOrganizationClientsController} from './GetOrganizationClientsController';
import { clientRepo } from "../../../repo/clients";
import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { xlsxService } from "../../../../../services/xlsxService";
import { organizationStatisticsService } from "../../../services/organizations/organizationStatisticsService";

const getOrganizationClientsUseCase = new GetOrganizationClientsUseCase(
    clientRepo, 
    organizationRepo, 
    organizationValidationService,
    xlsxService,
    organizationStatisticsService
);
const getOrganizationClientsController = new GetOrganizationClientsController(getOrganizationClientsUseCase);

export {
    getOrganizationClientsUseCase,
    getOrganizationClientsController
};