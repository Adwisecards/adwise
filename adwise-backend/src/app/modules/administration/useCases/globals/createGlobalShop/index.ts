import { paymentService } from "../../../../../services/paymentService";
import { globalRepo } from "../../../repo/globals";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { CreateGlobalShopController } from "./CreateGlobalShopController";
import { CreateGlobalShopUseCase } from "./CreateGlobalShopUseCase";

export const createGlobalShopUseCase = new CreateGlobalShopUseCase(globalRepo, paymentService, administrationValidationService);
export const createGlobalShopController = new CreateGlobalShopController(createGlobalShopUseCase);