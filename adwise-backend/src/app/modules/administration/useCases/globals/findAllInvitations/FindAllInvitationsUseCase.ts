import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IInvitationRepo } from "../../../../organizations/repo/invitations/IInvitationRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllInvitationsDTO } from "./FindAllInvitationsDTO";
import { findAllInvitationsErrors } from "./findAllInvitationsErrors";

export class FindAllInvitationsUseCase implements IUseCase<FindAllInvitationsDTO.Request, FindAllInvitationsDTO.Response> {
    private invitationRepo: IInvitationRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllInvitationsErrors;

    constructor(
        invitationRepo: IInvitationRepo,
        administrationValidationService: IAdministrationValidationService
    ) {
        this.invitationRepo = invitationRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllInvitationsDTO.Request): Promise<FindAllInvitationsDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber') continue;

            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        const invitationsFound = await this.invitationRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'subscription organization');
        if (invitationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon finding invitations"));
        }

        const invitations = invitationsFound.getValue()!;

        const invitationsCounted = await this.invitationRepo.count(parameterNames, parameterValues);
        if (invitationsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon counting invitations"));
        }

        const count = invitationsCounted.getValue()!;

        return Result.ok({
            count,
            invitations
        });
    }
}