import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import OrganizationPaymentType from "../../../../../core/static/OrganizationPaymentType";
import { ILegalRepo } from "../../../../legal/repo/legal/ILegalRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { SetOrganizationPaymentTypeDTO } from "./SetOrganizationPaymentTypeDTO";
import { setOrganizationPaymentTypeErrors } from "./setOrganizationPaymentTypeErrors";

export class SetOrganizationPaymentTypeUseCase implements IUseCase<SetOrganizationPaymentTypeDTO.Request, SetOrganizationPaymentTypeDTO.Response> {
    private legalRepo: ILegalRepo;
    private organizationRepo: IOrganizationRepo;
    
    public errors = setOrganizationPaymentTypeErrors;

    constructor(
        legalRepo: ILegalRepo,
        organizationRepo: IOrganizationRepo
    ) {
        this.legalRepo = legalRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: SetOrganizationPaymentTypeDTO.Request): Promise<SetOrganizationPaymentTypeDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        if (!OrganizationPaymentType.isValid(req.paymentType)) {
            return Result.fail(UseCaseError.create('c', 'paymentType is not valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
           return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }
        
        const organization = organizationFound.getValue()!;

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;

        if (!legal.paymentShopId && req.paymentType == 'split') {
            console.log(organization.paymentShopId);
            return Result.fail(UseCaseError.create('c', 'Organization cannot use splitted payments'));
        }

        organization.paymentType = req.paymentType;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: req.organizationId});
    }
}