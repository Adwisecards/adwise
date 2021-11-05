import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../services/mediaService/IMediaService";
import { IMediaRepo } from "../../repo/IMediaRepo";
import { IMediaValidationService } from "../../services/mediaValidationService/IMediaValidationService";
import { CreateMediaDTO } from "./CreateMediaDTO";
import { createMediaErrors } from "./createMediaErrors";
import * as uuid from 'uuid';
import MimeType from "../../../../core/static/MimeTypes";
import { MediaModel } from "../../models/Media";
import * as mime from 'mime-types';

export class CreateMediaUseCase implements IUseCase<CreateMediaDTO.Request, CreateMediaDTO.Response> {
    private mediaRepo: IMediaRepo;
    private mediaService: IMediaService;
    private mediaValidationService: IMediaValidationService;

    public errors = createMediaErrors;

    constructor(
        mediaRepo: IMediaRepo,
        mediaService: IMediaService,
        mediaValidationService: IMediaValidationService
    ) {
        this.mediaRepo = mediaRepo;
        this.mediaService = mediaService;
        this.mediaValidationService = mediaValidationService;
    }

    public async execute(req: CreateMediaDTO.Request): Promise<CreateMediaDTO.Response> {
        const valid = this.mediaValidationService.createMediaData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const filename = `${uuid.v4()}.${MimeType.getExtension(req.mimeType)}`; 

        const fileSaved = await this.mediaService.save(filename, req.data);
        if (fileSaved.isFailure) {
            console.log(fileSaved)
            return Result.fail(UseCaseError.create('a', 'Error upon saving file'));
        }

        const fileUrlParts = fileSaved.getValue()!.split('/');
        const finalFilename = fileUrlParts[fileUrlParts.length - 1];

        const media = new MediaModel({
            type: req.type,
            filename: finalFilename,
            mimeType: req.mimeType
        });

        const mediaSaved = await this.mediaRepo.save(media);
        if (mediaSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving media'));
        }

        return Result.ok({
            mediaId: media._id.toString()
        });
    }
}