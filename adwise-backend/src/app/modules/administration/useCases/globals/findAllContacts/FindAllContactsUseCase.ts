import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllContactsDTO } from "./FindAllContactsDTO";
import { findAllContactsErrors } from "./findAllContactsErrors";

export class FindAllContactsUseCase implements IUseCase<FindAllContactsDTO.Request, FindAllContactsDTO.Response> {
    private contactRepo: IContactRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllContactsErrors;

    constructor(contactRepo: IContactRepo, administrationValidationService: IAdministrationValidationService) {
        this.contactRepo = contactRepo;
        this.administrationValidationService = administrationValidationService
    }

    public async execute(req: FindAllContactsDTO.Request): Promise<FindAllContactsDTO.Response> {
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

        const contactsFound = await this.contactRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'organization employee');
        if (contactsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding contacts'));
        }

        const contacts = contactsFound.getValue()!;

        const countFound = await this.contactRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;
        
        return Result.ok({contacts, count});
    }
}