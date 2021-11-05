import { versionRepo } from "../../../repo/versions";
import { GetVersionsController } from "./GetVersionsController";
import { GetVersionsUseCase } from "./GetVersionsUseCase";

export const getVersionsUseCase = new GetVersionsUseCase(versionRepo);
export const getVersionsController = new GetVersionsController(getVersionsUseCase);