import { Types } from "mongoose";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IWalletService } from "../../../../services/walletService/IWalletService";
import { IContactRepo } from "../../../contacts/repo/contacts/IContactRepo";
import { IOrganization } from "../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../organizations/repo/organizations/IOrganizationRepo";
import { GetContactPassDTO } from "./GetContactPassDTO";
import { getContactPassErrors } from "./getContactPassErrors";

export class GetContactPassUseCase implements IUseCase<GetContactPassDTO.Request, GetContactPassDTO.Response> {
    private contactRepo: IContactRepo;
    private walletService: IWalletService;
    private organizationRepo: IOrganizationRepo;

    public errors = getContactPassErrors;

    constructor(contactRepo: IContactRepo, walletService: IWalletService, organizationRepo: IOrganizationRepo) {
        this.contactRepo = contactRepo;
        this.walletService = walletService;
        this.organizationRepo = organizationRepo;
        
    }

    public async execute(req: GetContactPassDTO.Request): Promise<GetContactPassDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId)) {
            return Result.fail(UseCaseError.create('c', 'contactId is not valid'));
        }

        const contactFound = await this.contactRepo.findById(req.contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding contact') : UseCaseError.create('w'));
        }

        const contact = contactFound.getValue()!;

        let organization: IOrganization;

        if (contact.type == 'work') {
            const organizationFound = await this.organizationRepo.findById(contact.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        }

        const passGenerated = await this.walletService.generateContactPass(contact._id.toString(), contact.requestRef.code, contact.firstName.value, contact.lastName.value, contact.activity.value, organization! ? organization!.name : '', contact.phone.value, contact.email.value);
        if (passGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating pass'));
        }

        const pass = passGenerated.getValue()!;

        return Result.ok({pass});
    }
}