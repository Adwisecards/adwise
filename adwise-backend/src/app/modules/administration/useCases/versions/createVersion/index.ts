import { versionRepo } from "../../../repo/versions";
import { versionValidationService } from "../../../services/versionValidationService";
import { CreateVersionController } from "./CreateVersionController";
import { CreateVersionUseCase } from "./CreateVersionUseCase";

export const createVersionUseCase = new CreateVersionUseCase(versionRepo, versionValidationService);
export const createVersionController = new CreateVersionController(createVersionUseCase);