import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { ICoupon } from "../../../models/Coupon";
import { IEmployee } from "../../../models/Employee";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { GetOrganizationDTO } from "./GetOrganizationDTO";
import { getOrganizationErrors } from "./getOrganizationErrors";

export class GetOrganizationUseCase implements IUseCase<GetOrganizationDTO.Request, GetOrganizationDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    public errors: UseCaseError[] = [
        ...getOrganizationErrors
    ];

    constructor(organizationRepo: IOrganizationRepo) {
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: GetOrganizationDTO.Request): Promise<GetOrganizationDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const organization = await organizationFound.getValue()!.populate('coupons employees').execPopulate();
        
        const organizationEmployeeContacts = (<any>organization.employees) as IContact[];
        
        for (const contactIndex in organizationEmployeeContacts) {
            organizationEmployeeContacts[contactIndex] = await organizationEmployeeContacts[contactIndex].populate('employee').execPopulate();
        }
        
        organization.coupons = (<any>organization.coupons).filter((c: ICoupon) => !c.disabled).map((c: any) => c._id);
        organization.employees = (<any>organization.employees).filter((e: any) => !e.employee.disabled).map((e: any) => e._id);

        return Result.ok({organization});
    }
}