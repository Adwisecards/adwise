import { versionRepo } from "../../../repo/versions";
import { versionValidationService } from "../../../services/versionValidationService";
import { UpdateVersionController } from "./UpdateVersionController";
import { UpdateVersionUseCase } from "./UpdateVersionUseCase";

export const updateVersionUseCase = new UpdateVersionUseCase(
    versionRepo,
    versionValidationService
);

export const updateVersionController = new UpdateVersionController(
    updateVersionUseCase
);