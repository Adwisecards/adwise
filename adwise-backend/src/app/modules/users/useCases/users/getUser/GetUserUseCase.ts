import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IEmployee } from "../../../../organizations/models/Employee";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { GetUserDTO } from "./GetUserDTO";
import { getUserErrors } from "./getUserErrors";

export class GetUserUseCase implements IUseCase<GetUserDTO.Request, GetUserDTO.Response> {
    private userRepo: IUserRepo;
    public errors = [
        ...getUserErrors
    ];

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(req: GetUserDTO.Request): Promise<GetUserDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const userPopulated = await this.userRepo.populate(user, 'organization contacts.organization contacts.employee.organization contacts contacts.employee account wallet', '');
        if (userPopulated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon populating user'));
        }

        const populatedUser = userPopulated.getValue()!;

        const enabledContacts: IContact[] = [];

        for (const contact of (<IContact[]>(<any>populatedUser.contacts))) {
            if (contact.employee && (<IEmployee>(<any>contact.employee)).disabled) {
                continue;
            }

            if (!req.populateEmployee && contact.employee) {
                contact.employee = (<IEmployee>(<any>contact.employee))._id;
            }

            enabledContacts.push(contact);
        }

        populatedUser.contacts = enabledContacts as any;

        // TEMP

        (<any>populatedUser).wallet.points = (<any>populatedUser).wallet.cashbackPoints + (<any>populatedUser).wallet.bonusPoints;
        (<any>populatedUser).wallet.cashbackPoints = 0;
        (<any>populatedUser).wallet.bonusPoints = 0;


        return Result.ok({user: populatedUser});
    }
}