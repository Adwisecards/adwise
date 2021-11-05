import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILegalInfoRequestRepo } from "../../../repo/legalInfoRequests/ILegalInfoRequestRepo";
import { ILegalInfoRequestValidationService } from "../../../services/legalInfoRequests/legalInfoRequestValidationService/ILegalInfoRequestValidationService";
import { CreateOrganizationNotificationUseCase } from "../../organizationNotifications/createOrganizationNotification/CreateOrganizationNotificationUseCase";
import { RejectLegalInfoRequestDTO } from "./RejectLegalInfoRequestDTO";
import { rejectLegalInfoRequestErrors } from "./rejectLegalInfoRequestErrors";

export class RejectLegalInfoRequestUseCase implements IUseCase<RejectLegalInfoRequestDTO.Request, RejectLegalInfoRequestDTO.Response> {
    private legalInfoRequestRepo: ILegalInfoRequestRepo;
    private legalInfoRequestValidationService: ILegalInfoRequestValidationService;
    private createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase;

    public errors = rejectLegalInfoRequestErrors;

    constructor(
        legalInfoRequestRepo: ILegalInfoRequestRepo,
        legalInfoRequestValidationService: ILegalInfoRequestValidationService,
        createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase
    ) {
        this.legalInfoRequestRepo = legalInfoRequestRepo;
        this.legalInfoRequestValidationService = legalInfoRequestValidationService;
        this.createOrganizationNotificationUseCase = createOrganizationNotificationUseCase;
    }

    public async execute(req: RejectLegalInfoRequestDTO.Request): Promise<RejectLegalInfoRequestDTO.Response> {
        const valid = this.legalInfoRequestValidationService.rejectLegalInfoRequestData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const legalInfoRequestFound = await this.legalInfoRequestRepo.findById(req.legalInfoRequestId);
        if (legalInfoRequestFound.isFailure) {
            return Result.fail(legalInfoRequestFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal info request') : UseCaseError.create('a3'));
        }

        const legalInfoRequest = legalInfoRequestFound.getValue()!;

        if (legalInfoRequest.rejected) {
            return Result.fail(UseCaseError.create('c', 'Legal info request is rejected'));
        }

        if (legalInfoRequest.satisfied) {
            return Result.fail(UseCaseError.create('c', 'Legal info request has been satisfied'));
        }

        legalInfoRequest.rejected = true;
        legalInfoRequest.rejectionReason = req.rejectionReason;

        const organizationNotificationCreated = await this.createOrganizationNotificationUseCase.execute({
            organizationId: legalInfoRequest.organization.toString(),
            type: 'legalInfoRequestRejected',
            legalInfoRequestId: legalInfoRequest._id.toString()
        });

        if (organizationNotificationCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating organization notification'));
        }
        
        const legalInfoRequestSaved = await this.legalInfoRequestRepo.save(legalInfoRequest);
        if (legalInfoRequestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving legal info request'));
        }

        return Result.ok({legalInfoRequestId: req.legalInfoRequestId});
    }
}