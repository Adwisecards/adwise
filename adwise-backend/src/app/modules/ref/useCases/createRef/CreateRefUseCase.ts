import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IRef, RefModel } from "../../models/Ref";
import { IRefRepo } from "../../repo/IRefRepo";
import { IRefValidationService } from "../../services/refValidationService/IRefValidationService";
import { CreateRefDTO } from "./CreateRefDTO";
import { createRefErrors } from "./createRefErrors";

export class CreateRefUseCase implements IUseCase<CreateRefDTO.Request, CreateRefDTO.Response> {
    private refRepo: IRefRepo;
    private refValidationService: IRefValidationService;

    public errors = createRefErrors;

    constructor(refRepo: IRefRepo, refValidationService: IRefValidationService) {
        this.refRepo = refRepo;
        this.refValidationService = refValidationService;
    }

    public async execute(req: CreateRefDTO.Request): Promise<CreateRefDTO.Response> {
        req.ref = req.ref.toString();
        
        const valid = this.refValidationService.createRefData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const lastRefFound = await this.refRepo.findLast();
        if (lastRefFound.isFailure && lastRefFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding ref'));
        }

        let lastRef: IRef;
        
        if (lastRefFound.isSuccess) {
            lastRef = lastRefFound.getValue()!;
        }

        const ref = new RefModel({
            type: req.type,
            mode: req.mode,
            ref: req.ref
        });

        ref.setCode(lastRef! ? lastRef!.code : '00000000');
        ref.setQRCode();

        const refSaved = await this.refRepo.save(ref);
        if (refSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving ref'));
        }

        return Result.ok(ref);
    }
}