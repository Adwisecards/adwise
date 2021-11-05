import { getOrganizationCitiesUseCase } from "../../../../organizations/useCases/organizations/getOrganizationCities";
import { userRepo } from "../../../repo/users";
import { userValidationService } from "../../../services/userValidationService";
import { SetUserCityController } from "./SetUserCityController";
import { SetUserCityUseCase } from "./SetUserCityUseCase";

export const setUserCityUseCase = new SetUserCityUseCase(
    userRepo,
    userValidationService,
    getOrganizationCitiesUseCase
);
export const setUserCityController = new SetUserCityController(setUserCityUseCase);