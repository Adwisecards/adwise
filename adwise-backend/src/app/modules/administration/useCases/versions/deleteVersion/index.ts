import { versionRepo } from "../../../repo/versions";
import { DeleteVersionController } from "./DeleteVersionController";
import { DeleteVersionUseCase } from "./DeleteVersionUseCase";

export const deleteVersionUseCase = new DeleteVersionUseCase(versionRepo);
export const deleteVersionController = new DeleteVersionController(deleteVersionUseCase);