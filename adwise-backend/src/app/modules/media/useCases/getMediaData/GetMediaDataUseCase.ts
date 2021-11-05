import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { mediaService } from "../../../../services/mediaService";
import { IMediaService } from "../../../../services/mediaService/IMediaService";
import { IMediaRepo } from "../../repo/IMediaRepo";
import { IMediaValidationService } from "../../services/mediaValidationService/IMediaValidationService";
import { GetMediaDataDTO } from "./GetMediaDataDTO";
import { getMediaDataErrors } from "./getMediaDataErrors";

export class GetMediaDataUseCase implements IUseCase<GetMediaDataDTO.Request, GetMediaDataDTO.Response> {
    private mediaRepo: IMediaRepo;
    private mediaService: IMediaService;
    private mediaValidationService: IMediaValidationService;

    public errors = getMediaDataErrors;

    constructor(
        mediaRepo: IMediaRepo,
        mediaService: IMediaService,
        mediaValidationService: IMediaValidationService
    ) {
        this.mediaRepo = mediaRepo;
        this.mediaService = mediaService;
        this.mediaValidationService = mediaValidationService;
    }

    public async execute(req: GetMediaDataDTO.Request): Promise<GetMediaDataDTO.Response> {
        const valid = this.mediaValidationService.getMediaDataData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const mediaFound = await this.mediaRepo.findById(req.mediaId);
        if (mediaFound.isFailure) {
            return Result.fail(mediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding media') : UseCaseError.create('a5'));
        }

        const media = mediaFound.getValue()!;

        const dataGotten = await mediaService.get(media.filename);
        if (dataGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting media data'));
        }

        const data = dataGotten.getValue()!;

        return Result.ok({
            data: data,
            mimeType: media.mimeType
        });
    }
}