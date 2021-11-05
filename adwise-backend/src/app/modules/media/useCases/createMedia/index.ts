import { mediaService } from "../../../../services/mediaService";
import { mediaRepo } from "../../repo";
import { mediaValidationService } from "../../services/mediaValidationService";
import { CreateMediaController } from "./CreateMediaController";
import { CreateMediaUseCase } from "./CreateMediaUseCase";

export const createMediaUseCase = new CreateMediaUseCase(
    mediaRepo,
    mediaService,
    mediaValidationService
);

export const createMediaController = new CreateMediaController(createMediaUseCase);