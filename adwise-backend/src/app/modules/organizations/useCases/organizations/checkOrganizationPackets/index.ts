import { timeService } from "../../../../../services/timeService";
import { organizationRepo } from "../../../repo/organizations";
import { CheckOrganizationPacketsUseCase } from "./CheckOrganizationPacketsUseCase";

const checkOrganizationPacketsUseCase = new CheckOrganizationPacketsUseCase(organizationRepo);

timeService.add(checkOrganizationPacketsUseCase);