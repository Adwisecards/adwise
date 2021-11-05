import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganization } from "../../../models/Organization";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { GetContactOrganizationsDTO } from "./GetContactOrganizationsDTO";
import { getContactOrganizationsErrors } from "./getContactOrganizationsErrors";

interface IKeyObjects {
    contact: IContact;
    organizations: IOrganization[];
    count: number;
};

export class GetContactOrganizationsUseCase implements IUseCase<GetContactOrganizationsDTO.Request, GetContactOrganizationsDTO.Response> {
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;

    public errors = getContactOrganizationsErrors;

    constructor(
        userRepo: IUserRepo,
        contactRepo: IContactRepo,
        organizationRepo: IOrganizationRepo,
        organizationValidationService: IOrganizationValidationService
    ) {
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: GetContactOrganizationsDTO.Request): Promise<GetContactOrganizationsDTO.Response> {
        const valid = this.organizationValidationService.getContactOrganizationsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.contactId, req.search || '.', req.categoryIds || [], req.sortBy || 'name', req.order || 1, req.limit || 10, req.page || 1);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            contact,
            organizations,
            count
        } = keyObjectsGotten.getValue()!;

        if (contact.ref.toString() != req.userId) {
            return Result.fail(UseCaseError.create('d', 'Contact does not belong to user'));
        }

        return Result.ok({organizations, count});
    }

    private async getKeyObjects(contactId: string, search: string, categoryIds: string[], sortBy: string, order: number, limit: number, page: number): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const contactFound = await this.contactRepo.findById(contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding contact') : UseCaseError.create('w'));
        }

        const contact = contactFound.getValue()!

        let organizationIds = contact.subscriptions.map(s => s.toString());

        // if (page && limit) {
        //     const startIndex = (page - 1) * limit;
        //     const endIndex = startIndex + limit;
        //     organizationIds = organizationIds.slice(startIndex, endIndex);
        // }
        
        const organizationsFound = await this.organizationRepo.searchByIds(organizationIds, search, categoryIds, sortBy, order, limit, page);
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        const organizationsCounted = await this.organizationRepo.countByIds(organizationIds, search, categoryIds);
        if (organizationsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting organizations'));
        }

        const count = organizationsCounted.getValue()!;

        return Result.ok({
            contact,
            organizations,
            count
        });
    }
}