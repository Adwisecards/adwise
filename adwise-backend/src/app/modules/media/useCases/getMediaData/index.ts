import { mediaService } from "../../../../services/mediaService";
import { mediaRepo } from "../../repo";
import { mediaValidationService } from "../../services/mediaValidationService";
import { GetMediaDataController } from "./GetMediaDataController";
import { GetMediaDataUseCase } from "./GetMediaDataUseCase";

export const getMediaDataUseCase = new GetMediaDataUseCase(
    mediaRepo,
    mediaService,
    mediaValidationService
);

export const getMediaDataController = new GetMediaDataController(getMediaDataUseCase);