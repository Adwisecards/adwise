import { organizationRepo } from "../../../repo/organizations";
import { GetOrganizationCitiesController } from "./GetOrganizationCitiesController";
import { GetOrganizationCitiesUseCase } from "./GetOrganizationCitiesUseCase";

export const getOrganizationCitiesUseCase = new GetOrganizationCitiesUseCase(organizationRepo);
export const getOrganizationCitiesController = new GetOrganizationCitiesController(getOrganizationCitiesUseCase);