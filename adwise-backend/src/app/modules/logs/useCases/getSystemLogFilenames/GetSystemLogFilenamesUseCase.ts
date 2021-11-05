import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { ILogger } from "../../../../services/logger/ILogger";
import { GetSystemLogFilenamesDTO } from "./GetSystemLogFilenamesDTO";
import { getSystemLogFilenamesErrors } from "./getSystemLogFilenamesErrors";

export class GetSystemLogFilenamesUseCase implements IUseCase<GetSystemLogFilenamesDTO.Request, GetSystemLogFilenamesDTO.Response> {
    private logger: ILogger;

    public errors = getSystemLogFilenamesErrors;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public async execute(_: GetSystemLogFilenamesDTO.Request): Promise<GetSystemLogFilenamesDTO.Response> {
        const systemLogFilesGotten = await this.logger.getLogFiles();
        if (systemLogFilesGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting system log files'));
        }

        const systemLogFiles = systemLogFilesGotten.getValue()!;

        const systemLogFilenames = systemLogFiles.map(f => f.filename);

        return Result.ok({
            systemLogFilenames
        });
    }
}