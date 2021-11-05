import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { LogModel } from "../../models/Log";
import { ILogRepo } from "../../repo/ILogRepo";
import { ILogValidationService } from "../../services/logValidationService/ILogValidationService";
import { CreateLogDTO } from "./CreateLogDTO";
import { createLogErrors } from "./createLogErrors";

export class CreateLogUseCase implements IUseCase<CreateLogDTO.Request, CreateLogDTO.Response> {
    private logRepo: ILogRepo;
    private logValidationService: ILogValidationService;

    public errors = createLogErrors;

    constructor(logRepo: ILogRepo, logValidationService: ILogValidationService) {
        this.logRepo = logRepo;
        this.logValidationService = logValidationService;
    }

    public async execute(req: CreateLogDTO.Request): Promise<CreateLogDTO.Response> {
        const valid = this.logValidationService.createLogData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const log = new LogModel({
            platform: req.platform,
            app: req.app,
            event: req.event,
            isError: req.isError,
            meta: req.meta,
            user: req.userId,
            message: req.message
        });

        const logSaved = await this.logRepo.save(log);
        if (logSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving log'));
        }

        return Result.ok({logId: log._id});
    }
}