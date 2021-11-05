import { logger } from "../../../../../services/logger";
import { TipsValidationService } from "./implementation/TipsValidationService";

export const tipsValidationService = new TipsValidationService(logger);