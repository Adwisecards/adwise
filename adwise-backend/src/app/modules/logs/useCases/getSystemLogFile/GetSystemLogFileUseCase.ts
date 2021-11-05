import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { ILogger } from "../../../../services/logger/ILogger";
import { GetSystemLogFileDTO } from "./GetSystemLogFileDTO";
import { getSystemLogFileErrors } from "./getSystemLogFileErrors";

export class GetSystemLogFileUseCase implements IUseCase<GetSystemLogFileDTO.Request, GetSystemLogFileDTO.Response> {
    private logger: ILogger;

    public errors = getSystemLogFileErrors;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public async execute(req: GetSystemLogFileDTO.Request): Promise<GetSystemLogFileDTO.Response> {
        if (!req.systemLogFilename) {
            return Result.fail(UseCaseError.create('c', 'systemLogFilename is not valid'));
        }

        const systemLogFilesGotten = await this.logger.getLogFiles();
        if (systemLogFilesGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting system log files'));
        }

        const systemLogFiles = systemLogFilesGotten.getValue()!;

        const systemLogFile = systemLogFiles.find(f => f.filename == req.systemLogFilename);
        if (!systemLogFile) {
            return Result.fail(UseCaseError.create('b', 'System log file does not exist'));
        }

        const data = systemLogFile.data.toString();

        return Result.ok({systemLogFile: data});
    }
}