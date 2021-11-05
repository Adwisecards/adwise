import { partnerRepo } from "../../../repo/partners";
import { GetPartnersController } from "./GetPartnersController";
import { GetPartnersUseCase } from "./GetPartnersUseCase";

export const getPartnersUseCase = new GetPartnersUseCase(partnerRepo);
export const getPartnersController = new GetPartnersController(getPartnersUseCase);