import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { IAddressDetails, IMapsService } from "../../../../../services/mapsService/IMapsService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { ILegal } from "../../../../legal/models/Legal";
import { ILegalRepo } from "../../../../legal/repo/legal/ILegalRepo";
import { IAddress } from "../../../../maps/models/Address";
import { IAddressRepo } from "../../../../maps/repo/addresses/IAddressRepo";
import { ICategory } from "../../../models/Category";
import { LegalInfoRequestModel } from "../../../models/LegalInfoRequest";
import { IOrganization } from "../../../models/Organization";
import { ICategoryRepo } from "../../../repo/categories/ICategoryRepo";
import { ILegalInfoRequestRepo } from "../../../repo/legalInfoRequests/ILegalInfoRequestRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { ILegalInfoRequestValidationService } from "../../../services/legalInfoRequests/legalInfoRequestValidationService/ILegalInfoRequestValidationService";
import { CreateLegalInfoRequestDTO } from "./CreateLegalInfoRequestDTO";
import { createLegalInfoRequestErrors } from "./createLegalInfoRequestErrors";

interface IKeyObjects {
    organization: IOrganization;
    global: IGlobal;
    category?: ICategory;
    address?: IAddress;
    legal?: ILegal;
    previousLegal?: ILegal;
};

export class CreateLegalInfoRequestUseCase implements IUseCase<CreateLegalInfoRequestDTO.Request, CreateLegalInfoRequestDTO.Response> {
    private legalRepo: ILegalRepo;
    private globalRepo: IGlobalRepo;
    private addressRepo: IAddressRepo;
    private mapsService: IMapsService;
    private emailService: IEmailService;
    private categoryRepo: ICategoryRepo;
    private organizationRepo: IOrganizationRepo;
    private legalInfoRequestRepo: ILegalInfoRequestRepo;
    private legalInfoRequestValidationService: ILegalInfoRequestValidationService;

    public errors = createLegalInfoRequestErrors;

    constructor(
        legalRepo: ILegalRepo,
        globalRepo: IGlobalRepo,
        addressRepo: IAddressRepo,
        mapsService: IMapsService,
        emailService: IEmailService,
        categoryRepo: ICategoryRepo,
        organizationRepo: IOrganizationRepo,
        legalInfoRequestRepo: ILegalInfoRequestRepo,
        legalInfoRequestValidationService: ILegalInfoRequestValidationService
    ) {
        this.legalRepo = legalRepo;
        this.globalRepo = globalRepo;
        this.addressRepo = addressRepo;
        this.mapsService = mapsService;
        this.emailService = emailService;
        this.categoryRepo = categoryRepo;
        this.organizationRepo = organizationRepo;
        this.legalInfoRequestRepo = legalInfoRequestRepo;
        this.legalInfoRequestValidationService = legalInfoRequestValidationService;
    }

    public async execute(req: CreateLegalInfoRequestDTO.Request): Promise<CreateLegalInfoRequestDTO.Response> {
        const valid = this.legalInfoRequestValidationService.createLegalInfoRequestData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId, req.categoryId, req.addressId, req.legalId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            global,
            organization,
            category,
            address,
            previousLegal,
            legal
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != req.userId) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        const legalInfoRequest = new LegalInfoRequestModel({
            organization: req.organizationId,
            legal: legal,
            category: category || organization.category,
            name: req.name || organization.name,
            emails: req.emails && req.emails.length ? req.emails : organization.emails,
            phones: req.phones && req.phones.length ? req.phones : organization.phones,
            previousLegal: previousLegal,
            address: address || organization.address,
            comment: req.comment
        });

        const legalInfoRequestSaved = await this.legalInfoRequestRepo.save(legalInfoRequest);
        if (legalInfoRequestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving legal info request'));
        }

        await this.emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'legalInfoRequest', {
            name: organization.name,
            requestId: legalInfoRequest._id.toString()
        });

        return Result.ok({
            legalInfoRequestId: legalInfoRequest._id.toString()
        });
    }

    private async getKeyObjects(organizationId: string, categoryId?: string, addressId?: string, legalId?: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalFound = await this.globalRepo.getGlobal();
        if (globalFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let category: ICategory | undefined;

        if (categoryId) {
            const categoryFound = await this.categoryRepo.findById(categoryId);
            if (categoryFound.isFailure) {
                return Result.fail(categoryFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding category') : UseCaseError.create('j'));
            }

            category = categoryFound.getValue()!;
        }

        let address: IAddress | undefined;

        if (addressId) {
            const addressFound = await this.addressRepo.findById(addressId);
            if (addressFound.isFailure) {
                return Result.fail(addressFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding address') : UseCaseError.create('a9'));
            }

            address = addressFound.getValue()!;
        }

        let legal: ILegal | undefined;

        if (legalId) {
            const legalFound = await this.legalRepo.findById(legalId);
            if (legalFound.isFailure) {
                return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
            }

            legal = legalFound.getValue()!;
        }

        let previousLegal: ILegal | undefined;

        const previousLegalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (previousLegalFound.isSuccess) {
            previousLegal = previousLegalFound.getValue()!;
        }

        return Result.ok({
            global,
            organization,
            category,
            address,
            legal,
            previousLegal
        });
    }
}