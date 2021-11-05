import { logger } from "../../../../services/logger";
import { VersionValidationService } from "./implementation/VersionValidationService";

export const versionValidationService = new VersionValidationService(logger);